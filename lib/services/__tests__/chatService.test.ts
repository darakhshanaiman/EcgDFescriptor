import { createMessagePayload, sendMessageToApi, ChatServiceError } from '../chatService';

// Extract original global fetch
const originalFetch = global.fetch;

describe('Chat Service Layer', () => {
  beforeEach(() => {
    // Mock the global fetch
    global.fetch = jest.fn();
  });

  afterAll(() => {
    // Restore global fetch
    global.fetch = originalFetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Message Payload Creation', () => {
    it('creates a valid payload structure with history', () => {
      const history = [{ role: 'assistant' as const, content: 'Hello!' }];
      const payload = createMessagePayload('Hi there', history);
      
      expect(payload).toEqual({
        messages: [
          { role: 'assistant', content: 'Hello!' },
          { role: 'user', content: 'Hi there' }
        ]
      });
    });

    it('creates a payload without prior history', () => {
      const payload = createMessagePayload('Starting a new chat');
      expect(payload).toEqual({
        messages: [
          { role: 'user', content: 'Starting a new chat' }
        ]
      });
    });
  });

  describe('API Response Parsing', () => {
    it('parses valid API response reply correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ reply: 'This is the parsed response!' })
      });

      const reply = await sendMessageToApi({ messages: [] }, 'fake-token');
      expect(reply).toBe('This is the parsed response!');
      
      // Verify fetch was called with right arguments
      expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/api/chat', expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token'
        }
      }));
    });
  });

  describe('Offline Error Handling', () => {
    it('throws offline error when fetch rejects with a network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network request failed'));

      // Validate exactly that a ChatServiceError is thrown with the "Offline:" message indicator
      await expect(sendMessageToApi({ messages: [] }, 'fake-token')).rejects.toThrow(ChatServiceError);
      await expect(sendMessageToApi({ messages: [] }, 'fake-token')).rejects.toThrow(/Offline/);
    });
  });

  describe('Unauthorized Error Handling', () => {
    it('throws unauthorized error on 401 response', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401
      });

      try {
        await sendMessageToApi({ messages: [] }, 'invalid-token');
        // Fail the test if the above line doesnt throw
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error).toBeInstanceOf(ChatServiceError);
        expect(error.status).toBe(401);
        expect(error.message).toMatch(/Unauthorized/);
      }
    });

    it('throws generic API error for other non-ok statuses', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500
      });

      await expect(sendMessageToApi({ messages: [] }, 'fake-token')).rejects.toThrow(/API error: 500/);
    });
  });

  describe('Empty Response Handling', () => {
    it('throws error if response is missing the reply field completely', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'success' }) // Missing 'reply' field
      });

      await expect(sendMessageToApi({ messages: [] }, 'fake-token')).rejects.toThrow(/Empty response/);
    });

    it('throws error if API returns an explicitly empty reply string', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => ({ reply: '    ' }) // Empty/whitespace reply
        });
  
        await expect(sendMessageToApi({ messages: [] }, 'fake-token')).rejects.toThrow(/Empty response/);
    });

    it('throws error if response body is null', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => null
      });

      await expect(sendMessageToApi({ messages: [] }, 'fake-token')).rejects.toThrow(/Empty response/);
    });
  });
});
