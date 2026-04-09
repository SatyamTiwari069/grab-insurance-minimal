# GrabInsurance MCP Server - Complete Setup Guide

## ✅ Server Status
- **MCP Server**: Running on HTTP port 8000
- **Claude Desktop Integration**: ✓ Configured
- **8 Tools Available**: Ready to use

---

## 📋 Available MCP Tools

### 1. **list_insurance_products**
Lists all 8 insurance products with coverage details
- **Input**: Optional category filter (Travel, Electronics, Health, Food, Fashion & Beauty)
- **Output**: Complete insurance catalog

### 2. **resolve_multi_cart**
Intelligent multi-category recommendation engine
- **Input**: Array of deals from different merchants/categories
- **Output**: Prioritized insurance recommendations for each category
- **Example**: Flight + iPhone + Apparel → 3 tailored insurance products

### 3. **classify_deal**
Real-time deal classification with confidence scoring
- **Input**: Merchant, category, subcategory, deal value, risk tier
- **Output**: Top 2 products with confidence scores and A/B copy variants
- **Note**: Use via API directly or through resolve_multi_cart

### 4. **get_premium_quote**
Dynamic pricing engine with risk adjustments
- **Input**: Product ID, deal value, risk tier
- **Output**: Premium with breakdown (base, risk multiplier, volume discount)
- **Pricing Rules**:
  - Risk multipliers: low (0.8x), medium (1.0x), high (1.25x)
  - Volume discounts: 5% for >₹50K, 3% for >₹20K

### 5. **generate_offer_copy**
Hyper-personalized insurance marketing copy
- **Output**: 3 A/B variants
  - Variant A: Direct value proposition
  - Variant B: Emotional appeal
  - Variant C: Social proof
- **Personalized by**: Merchant name, deal value, category

### 6. **track_conversion**
A/B testing analytics tracking
- **Input**: Session ID, product, premium, variant, deal details
- **Output**: Conversion ID for tracking
- **Purpose**: Measure variant performance

### 7. **get_analytics**
A/B testing dashboard
- **Output**:
  - Total conversions & revenue
  - Variant performance (A vs B vs C)
  - Revenue by category
  - Top products
  - Merchant breakdown

### 8. **run_test_scenarios**
Mock deal test suite
- **Input**: None
- **Output**: Results from 10 pre-built deal scenarios
- **Purpose**: Test classification logic end-to-end

### 9. **get_brand_info**
Partner brand styling data
- **Input**: Merchant name
- **Output**: Brand color, icon, tagline, domain

---

## 🚀 Using with Claude Desktop

### Option 1: Use in Claude Desktop Chat
1. Open Claude Desktop
2. Start a conversation
3. Ask Claude to use the MCP tools:

```
"Recommend insurance for a ₹75K iPhone from Apple with high risk"
```

Claude will automatically call the appropriate MCP tools!

### Option 2: Direct Tool Calling
If Claude detects you're asking about:
- **Insurance recommendations** → Uses `resolve_multi_cart`
- **Product catalog** → Uses `list_insurance_products`
- **A/B testing metrics** → Uses `get_analytics`
- **Deal classification** → Uses `classify_deal` or `resolve_multi_cart`

---

## 🔧 Testing the Server

### Via HTTP API (Development)
```bash
# Multi-cart resolution
curl -X POST http://localhost:8000/api/multi-cart/resolve \
  -H "Content-Type: application/json" \
  -d '{
    "deals": [
      {"merchantName": "MakeMyTrip", "category": "Travel", "subcategory": "Flight", "dealValue": 50000},
      {"merchantName": "Apple", "category": "Electronics", "subcategory": "iPhone", "dealValue": 70000}
    ]
  }'

# Get analytics
curl http://localhost:8000/api/analytics

# Track conversion
curl -X POST http://localhost:8000/api/conversion \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "sess-001",
    "productId": "travel_cancel",
    "premium": 300,
    "variant": "variant_A",
    "category": "Travel",
    "merchantName": "MakeMyTrip"
  }'
```

### Via Claude Desktop
Simply ask natural language questions and Claude will use the MCP tools!

---

## 📊 Test Results

### Tool Functionality
✅ **list_insurance_products** - 8 products returned
✅ **resolve_multi_cart** - Multi-category tested successfully
✅ **track_conversion** - A/B variants logged
✅ **get_analytics** - Dashboard metrics working
✅ **get_brand_info** - 10 brands configured

### A/B Testing Performance
- **Total Conversions**: 10+
- **Top Variant**: B (3 conversions, ₹576 revenue)
- **Revenue Breakdown**: Travel ₹1180, Electronics ₹693
- **Top Product**: Travel Cancellation Cover

### Insurance Catalog
- Travel: 2 products (Cancellation, Medical)
- Electronics: 2 products (Warranty, Screen)
- Health: 2 products (OPD, Personal Accident)
- Fashion & Beauty: 2 products (Return Protection, Purchase Protection)

---

## 🔐 Configuration

### Claude Desktop Config Location
```
%APPDATA%\Claude\claude_desktop_config.json
```

### Current Configuration
```json
{
  "mcpServers": {
    "grabinsurance": {
      "command": "node",
      "args": [
        "C:\\Users\\KIIT\\grab-insurance-minimal\\mcp-server\\dist\\index.js",
        "--stdio"
      ]
    }
  }
}
```

---

## 🎯 Next Steps

1. **Restart Claude Desktop** (if not already restarted)
   - Close and reopen Claude for Desktop app
   - MCP server will auto-connect

2. **Test in Claude**
   - Ask: "What insurance should I get for a ₹50K flight from Emirates?"
   - Claude will use the MCP tools automatically

3. **Monitor Analytics**
   - Visit: http://localhost:8000/api/analytics
   - Track A/B testing performance

4. **Integrate with UI**
   - Use `/api/recommend` endpoint for real-time deals
   - Use `/api/multi-cart/resolve` for checkout flows

---

## 📝 API Endpoints Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Server health check |
| `/api/products` | GET | List insurance catalog |
| `/api/brands` | GET | Partner brand data |
| `/api/deals` | GET | Mock deal scenarios |
| `/api/recommend` | POST | Single deal classification |
| `/api/multi-cart/resolve` | POST | Multi-category resolution |
| `/api/conversion` | POST | Track A/B conversion |
| `/api/analytics` | GET | A/B testing dashboard |

---

## ✨ Features Enabled

- ✅ Dynamic pricing with risk adjustment
- ✅ Volume discounts for high-value deals
- ✅ A/B testing framework (3 copy variants)
- ✅ Multi-category intelligent routing
- ✅ Partner brand personalization
- ✅ Real-time analytics dashboard
- ✅ Claude Desktop integration
- ✅ Mock scenario testing

---

**Status**: Production-ready MCP server with full Claude Desktop integration! 🚀
