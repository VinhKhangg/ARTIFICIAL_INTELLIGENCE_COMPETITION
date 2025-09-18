// services/api.js
import { API_CONFIG } from '../config/constants';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

class ApiService {
  // YOLO detection
  static async detectIngredients(imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`${BASE_URL}${ENDPOINTS.DETECT}`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success && data.ingredients) {
        return data.ingredients;
      } else {
        console.error('Detection failed:', data.error);
        return [];
      }
    } catch (error) {
      console.error('Error in detectIngredients:', error);
      return [];
    }
  }

  // Recipe generation - Updated for multiple recipes
  static async generateRecipe(ingredients) {
    try {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.GENERATE_RECIPE}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ingredients})
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Handle new multiple recipes format
        if (data.recipes && data.recipes.length > 0) {
          return {
            success: true,
            recipes: data.recipes,
            total_recipes: data.total_recipes || data.recipes.length,
            ingredients_used: data.ingredients_used || ingredients,
            has_context: data.has_context || false
          };
        }
        // Backward compatibility for single recipe
        else if (data.recipe) {
          return {
            success: true,
            recipes: [{
              id: 1,
              title: 'Công thức',
              content: data.recipe,
              full_text: data.recipe
            }],
            total_recipes: 1,
            ingredients_used: data.ingredients_used || ingredients,
            has_context: false
          };
        }
      }
      
      throw new Error(data.error || 'Failed to generate recipe');
    } catch (error) {
      console.error('Error in generateRecipe:', error);
      throw error;
    }
  }
  

  // Start chat session with context
  static async startChatSession(ingredients, recipe) {
    try {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.START_CHAT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          recipe
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.session_id) {
        console.log('✅ Chat session started:', data.session_id);
        return data.session_id;
      } else {
        console.error('Failed to start chat session:', data.error);
        return null;
      }
    } catch (error) {
      console.error('Error starting chat session:', error);
      return null;
    }
  }

  // End chat session
  static async endChatSession(sessionId) {
    try {
      await fetch(`${BASE_URL}${ENDPOINTS.END_CHAT}/${sessionId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error ending chat session:', error);
    }
  }

  // Create streaming response
  static async createStreamingResponse(sessionId, question) {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.CHAT_STREAM}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        question: question
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to start streaming');
    }
    
    return response;
  }
}

export default ApiService;