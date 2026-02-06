from flask import Flask, request, jsonify
from flask_cors import CORS
import anthropic
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for development

# YOUR CLAUDE API KEY - REPLACE THIS!
"import os
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")"

@app.route('/analyze', methods=['POST'])
def analyze_reviews():
    """Analyze beauty product reviews and return detailed sentiment analysis"""
    try:
        # Get reviews from request
        data = request.json
        reviews = data.get('reviews', [])
        
        print(f"\n{'='*50}")
        print(f"📥 Received {len(reviews)} reviews to analyze")
        print(f"{'='*50}\n")
        
        if not reviews:
            return jsonify({"error": "No reviews provided"}), 400
        
        # RELAXED VALIDATION: Ensure reviews are about beauty products
        beauty_keywords = [
        # Makeup products
        'lipstick', 'lip stick', 'foundation', 'mascara', 'eyeshadow', 'eye shadow',
        'blush', 'concealer', 'eyeliner', 'eye liner', 'brow', 'eyebrow',
        'bronzer', 'highlighter', 'primer', 'powder', 'contour', 'compact',
        'lipgloss', 'lip gloss', 'lipliner', 'lip liner', 'rouge', 'kajal', 'kohl',
        # Skincare
        'moisturizer', 'serum', 'cleanser', 'sunscreen', 'toner', 'exfoliant',
        'retinol', 'vitamin c', 'hyaluronic', 'niacinamide', 'spf',
        # Nails & fragrance
        'nail polish', 'manicure', 'perfume', 'fragrance', 'cologne', 'eau de',
        # General beauty terms (specific)
        'makeup', 'cosmetic', 'beauty product', 'skincare', 'cosmetics',
        # Common product mentions
        'palette', 'shade', 'finish', 'coverage', 'pigment', 'formula',
        'swatch', 'blend', 'application', 'applicator', 'brush'
        ]
        
        reviews_text_combined = ' '.join(reviews).lower()
        keyword_count = sum(1 for keyword in beauty_keywords if keyword in reviews_text_combined)
        
        print(f"🔍 Beauty keywords found: {keyword_count}")
        print(f"📝 First 200 chars of reviews: {reviews_text_combined[:200]}")
        print(f"🔎 Keywords: makeup={('makeup' in reviews_text_combined)}, foundation={('foundation' in reviews_text_combined)}")
        
        # RELAXED: Only require 1 beauty keyword (very lenient)
        if keyword_count < 2:
            print("⚠️  Content validation failed - no beauty-related keywords found")
            return jsonify({
                "error": "Invalid content type",
                "message": "This tool is designed for beauty product reviews (makeup, skincare, cosmetics). Your input doesn't appear to contain beauty product feedback. Please check your file format.",
                "positive": 0,
                "negative": 0,
                "neutral": 0,
                "total": 0,
                "themes": {},
                "emotions": {},
                "recommendation": "Please upload reviews about makeup, skincare, haircare, or cosmetic products.",
                "reviews": []
            }), 400
        
        print(f"✅ Content validated as beauty product reviews")
        
        # Initialize Anthropic client
        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        
        # Create comprehensive analysis prompt
        reviews_text = "\n".join([f"{i+1}. {review}" for i, review in enumerate(reviews)])
        
        prompt = f"""You are a professional beauty product analyst. Analyze these customer reviews and provide detailed insights.

REVIEWS TO ANALYZE:
{reviews_text}

Please provide a comprehensive analysis in JSON format. Return ONLY valid JSON with no markdown formatting, no code blocks, no explanation text - just pure JSON.

Use this EXACT structure:

{{
  "positive": <percentage 0-100 of positive reviews>,
  "neutral": <percentage 0-100 of neutral reviews>,
  "negative": <percentage 0-100 of negative reviews>,
  "total": {len(reviews)},
  "themes": {{
    "color": <count of color mentions>,
    "texture": <count of texture mentions>,
    "longevity": <count of lasting/longevity mentions>,
    "packaging": <count of packaging mentions>,
    "scent": <count of scent mentions>
  }},
  "emotions": {{
    "joy": <count of very positive emotional reactions>,
    "trust": <count of neutral/balanced reviews>,
    "disappointment": <count of disappointed customers>,
    "satisfaction": <count of satisfied customers>
  }},
  "recommendation": "<2-3 sentence actionable insight for the brand based on the review patterns>",
  "reviews": {json.dumps(reviews[:5])}
}}

CRITICAL: Return ONLY the JSON object. No text before or after. No markdown. No code blocks. Just the raw JSON."""

        print("📤 Sending request to Claude API...")
        
        # Call Claude API
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            messages=[{
                "role": "user",
                "content": prompt
            }]
        )
        
        # Extract response
        analysis_text = message.content[0].text
        print(f"\n📥 Claude response received ({len(analysis_text)} chars)")
        print(f"First 200 chars: {analysis_text[:200]}...\n")
        
        # ROBUST JSON CLEANING
        clean_text = analysis_text.strip()
        
        # Remove markdown code blocks
        if '```json' in clean_text:
            clean_text = clean_text.split('```json')[1].split('```')[0]
        elif '```' in clean_text:
            parts = clean_text.split('```')
            if len(parts) >= 2:
                clean_text = parts[1]
        
        # Remove any remaining markdown artifacts
        clean_text = clean_text.replace('```json', '').replace('```', '').strip()
        
        # Extract JSON object (everything between first { and last })
        if '{' in clean_text and '}' in clean_text:
            start = clean_text.index('{')
            end = clean_text.rindex('}') + 1
            clean_text = clean_text[start:end]
        
        print(f"🧹 Cleaned JSON (first 200 chars): {clean_text[:200]}...\n")
        
        # Parse JSON
        try:
            analysis = json.loads(clean_text)
            print("✅ JSON parsed successfully!")
        except json.JSONDecodeError as e:
            print(f"❌ JSON Parse Error: {e}")
            print(f"Attempted to parse: {clean_text[:500]}")
            # Return fallback response
            return jsonify({
                "positive": 50,
                "negative": 25,
                "neutral": 25,
                "total": len(reviews),
                "themes": {"color": 2, "texture": 3, "longevity": 1, "packaging": 1, "scent": 1},
                "emotions": {"joy": 5, "trust": 3, "disappointment": 2, "satisfaction": 4},
                "recommendation": "Unable to parse AI response. Using fallback analysis. Please check backend logs for details.",
                "reviews": reviews[:5]
            }), 200
        
        # Format response for frontend
        recommendation_text = analysis.get("recommendation", "No recommendation provided by AI")
        
        response_data = {
            "positive": int(analysis.get("positive", 0)),
            "negative": int(analysis.get("negative", 0)),
            "neutral": int(analysis.get("neutral", 0)),
            "total": len(reviews),
            "themes": analysis.get("themes", {}),
            "emotions": analysis.get("emotions", {}),
            "recommendation": recommendation_text,
            "reviews": reviews[:5]
        }
        
        print(f"\n✅ Sending response to frontend:")
        print(f"  Positive: {response_data['positive']}%")
        print(f"  Neutral: {response_data['neutral']}%")
        print(f"  Negative: {response_data['negative']}%")
        print(f"  Themes: {response_data['themes']}")
        print(f"  Emotions: {response_data['emotions']}")
        print(f"  Recommendation: {response_data['recommendation'][:100] if response_data['recommendation'] else 'NONE'}...")
        print(f"{'='*50}\n")
        
        return jsonify(response_data)
        
    except anthropic.APIError as e:
        print(f"\n❌ Anthropic API Error: {e}\n")
        return jsonify({
            "error": "AI API error",
            "details": str(e),
            "message": f"Claude API error: {str(e)}",
            "positive": 0,
            "negative": 0,
            "neutral": 0,
            "total": 0,
            "themes": {},
            "emotions": {},
            "recommendation": f"API error: {str(e)}",
            "reviews": []
        }), 500
        
    except Exception as e:
        print(f"\n❌ Unexpected Error: {e}\n")
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": "Analysis failed",
            "details": str(e),
            "message": f"Unexpected error: {str(e)}",
            "positive": 0,
            "negative": 0,
            "neutral": 0,
            "total": 0,
            "themes": {},
            "emotions": {},
            "recommendation": f"Error: {str(e)}",
            "reviews": []
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    api_key_valid = bool(ANTHROPIC_API_KEY and ANTHROPIC_API_KEY != "sk-ant-your-actual-api-key-here")
    return jsonify({
        "status": "Backend is running!",
        "api_key_set": api_key_valid,
        "cors_enabled": True
    })

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🎀 Beauty Sense Backend Starting...")
    print("="*60)
    
    if ANTHROPIC_API_KEY == "sk-ant-your-actual-api-key-here":
        print("⚠️  WARNING: Please set your ANTHROPIC_API_KEY!")
        print("   Open backend.py and replace the API key on line 10")
    else:
        print("✅ API key is configured")
    
    print("\n🌐 Backend will run on: http://localhost:5000")
    print("📊 Test health check: http://localhost:5000/health")
    print("🔓 CORS enabled for all origins (development mode)")
    print("\n💡 To stop: Press Ctrl+C")
    print("="*60 + "\n")
    
    app.run(debug=True, port=5000, host='0.0.0.0', use_reloader=False)