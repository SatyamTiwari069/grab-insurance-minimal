# 🚀 How to Run GrabInsurance Project 2

## Quick Start (Choose One)

### Option 1: Use Claude Desktop with MCP Tools (Easiest)

**Step 1: Restart Claude Desktop**
- Close Claude Desktop completely
- Reopen it (it will auto-load the MCP configuration)

**Step 2: Use MCP Tools in Chat**
```
In Claude Desktop, ask:
"Use the get_insurance_products tool to list all insurance products"
```

The app will run via MCP tools without needing anything else. Claude will have access to all the backend logic.

**Available Commands:**
```
- Use get_insurance_products
- Use classify_deal_intent with merchantName: "MakeMyTrip", category: "Travel", dealValue: 12400
- Use calculate_premium for dealValue: 25000, productId: "screen_damage"
- Use generate_copy_variants for a specific product
- Use record_conversion to track purchases
- Use get_analytics to see real-time metrics
```

---

### Option 2: Run Backend + Web Artifact (Interactive UI)

**Step 1: Start Backend Server**
```powershell
cd c:\Users\KIIT\grab-insurance-minimal\mcp-server
npm start
```

This starts the HTTP API on `http://localhost:8000`

**Step 2: Open Claude Chat and Request the Artifact**
```
Create an interactive HTML artifact for GrabInsurance Project 2 with:
- Simulator tab for deal selection
- Storefront tab for browsing insurance products
- Analytics tab for real-time conversion metrics
- Real-time connection to http://localhost:8000/api
```

Or just use the artifact I already created - ask Claude to display it.

**Step 3: Use the UI**
- Select deals in Simulator tab
- Browse products in Storefront tab
- Track conversions in Analytics tab
- Watch real-time updates every 3 seconds

---

### Option 3: Run Everything Together (Full Experience)

**Step 1: Start Backend**
```powershell
cd c:\Users\KIIT\grab-insurance-minimal\mcp-server
npm start
```

**Step 2: Restart Claude Desktop**
- Close and reopen Claude Desktop

**Step 3: In Claude Chat - Use Both**
```
Option A: Use web artifact (interactive UI)
- Display the GrabInsurance artifact
- Interact with the UI

Option B: Use MCP tools
- Ask Claude to use get_insurance_products
- Ask Claude to classify deals
- Ask Claude to view analytics
```

Both will work with the same backend data, so purchases in the UI will be visible in the analytics tool.

---

## Step-by-Step for Each Option

### 🎯 Option 1: MCP Tools Only (No Backend GUI Needed)

```
1. Open Claude Desktop
2. Type: "Use get_insurance_products"
3. Claude shows all products
4. Ask: "Classify this deal: MakeMyTrip Flight ₹12,400"
5. Get recommendations with confidence scores
6. Done! No extra steps needed
```

**Time to start**: 30 seconds

**Best for**: Quick data access, integration, automation

---

### 🎨 Option 2: Web Artifact Only (Visual UI)

```
1. Open Terminal
2. Run: npm start (from mcp-server folder)
3. Open Claude Chat
4. Ask for the GrabInsurance artifact
5. Interact with the UI in Claude
6. Click deals → View recommendations → Purchase insurance
7. Watch analytics update in real-time
```

**Time to start**: 1 minute

**Best for**: Visual demo, user-friendly interface

---

### ⚡ Option 3: MCP + Artifact (Full Power)

```
1. Open Terminal in mcp-server folder
2. Run: npm start (backend starts)
3. Close/reopen Claude Desktop (MCP loads)
4. In Claude:
   - Ask to display artifact
   - ALSO use MCP tools simultaneously
5. Use artifact for UI, tools for data
```

**Time to start**: 1.5 minutes

**Best for**: Complete solution, impressive demo

---

## What Each Option Gives You

| Feature | MCP Only | Artifact Only | Both |
|---------|----------|---------------|------|
| Interactive UI | ❌ | ✅ | ✅ |
| MCP Tools | ✅ | ❌ | ✅ |
| Real-time Analytics | ✅ | ✅ | ✅ |
| Backend Data | ✅ | ✅ | ✅ |
| Visual Design | ❌ | ✅ | ✅ |
| Quick Start | ✅✅ | ✅ | ✅ |

---

## Running Commands Reference

### Start Backend Server
```powershell
cd c:\Users\KIIT\grab-insurance-minimal\mcp-server
npm start
```
Output: Shows "GrabInsurance Server running on http://localhost:8000"

### Stop Backend Server
```
Press Ctrl+C in the terminal
```

### Check if Backend is Running
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/health"
```
Should return: `{"status":"ok","products":8,"brands":10}`

### Rebuild MCP (if you modify code)
```powershell
cd c:\Users\KIIT\grab-insurance-minimal\mcp-server
npm run build
```

---

## Troubleshooting

### "Port 8000 already in use"
```powershell
# Find process using port 8000
Get-NetTCPConnection -LocalPort 8000 | Select-Object -ExpandProperty OwningProcess | Get-Process

# Or just start on a different port
PORT=8001 npm start
```

### "MCP tools not appearing in Claude"
1. Restart Claude Desktop completely
2. Check: `$env:APPDATA\Claude\claude_desktop_config.json` exists
3. Verify: `npm run build` was successful in mcp-server

### "Artifact won't connect to backend"
1. Make sure backend is running: `npm start`
2. Check: `http://localhost:8000/api/health` responds
3. Verify: Port 8000 is not blocked

### "Command not found: npm"
1. Install Node.js from nodejs.org
2. Restart terminal
3. Try again

---

## Demo Flow (5 minutes)

### Using MCP Tools Demo:
```
"I want to test Project 2 insurance classification. Can you:
1. Use get_insurance_products - show all products
2. Classify a MakeMyTrip deal for ₹12,400
3. Calculate premium for top product
4. Generate A/B copy variants
5. Show current analytics"
```

### Using Artifact Demo:
```
1. Start backend (npm start)
2. Display artifact in Claude
3. Select "MakeMyTrip" deal
4. Click "Purchase Insurance" on recommendation
5. Switch to Analytics tab
6. Show conversion tracked in real-time
```

### Using Both Demo:
```
1. Backend running
2. Display artifact
3. Make purchase in artifact
4. Use get_analytics tool in Claude
5. Show live data sync between UI and tools
```

---

## File Locations

```
Backend:
  C:\Users\KIIT\grab-insurance-minimal\mcp-server\src\index.ts
  C:\Users\KIIT\grab-insurance-minimal\mcp-server\dist\index.js (compiled)

Web Artifact:
  C:\Users\KIIT\grab-insurance-minimal\frontend\PROJECT_2_ARTIFACT.html

Configuration:
  %APPDATA%\Claude\claude_desktop_config.json
  (Usually: C:\Users\KIIT\AppData\Roaming\Claude\)
```

---

## Architecture

```
┌─────────────────────────────────────┐
│       YOUR COMPUTER                 │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Claude Desktop             │    │
│  │  ┌─────────────────────┐    │    │
│  │  │  MCP Tools          │    │    │
│  │  │  (use immediately)  │    │    │
│  │  └─────────────────────┘    │    │
│  │  ┌─────────────────────┐    │    │
│  │  │  Web Artifact       │    │    │
│  │  │  (visual UI)        │    │    │
│  │  └─────────────────────┘    │    │
│  └──────────────┬──────────────┘    │
│                 │                   │
│                 ↓                   │
│  ┌─────────────────────────────┐    │
│  │  Backend Server             │    │
│  │  localhost:8000             │    │
│  │  ├─ Intent Classification   │    │
│  │  ├─ Dynamic Pricing         │    │
│  │  ├─ Copy Generation         │    │
│  │  └─ Analytics Tracking      │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

---

## What's Actually Running

- **MCP Server**: Uses stdio (no port), connects to Claude automatically
- **HTTP Backend**: Port 8000, serves API endpoints
- **Web Artifact**: Runs in Claude chat UI (no port needed)
- **Database**: In-memory on the backend (real-time sync)

All components communicate through localhost and sync in real-time.

---

## Summary

**Fastest Way (30 seconds):**
```
1. Open Claude Desktop
2. Ask: "Use get_insurance_products"
3. Done!
```

**Best Visual (1 minute):**
```
1. npm start
2. Display artifact in Claude
3. Click and interact
```

**Complete Experience (1.5 minutes):**
```
1. npm start
2. Restart Claude
3. Use both artifact + tools simultaneously
```

Choose based on what you want to demonstrate! 🎯
