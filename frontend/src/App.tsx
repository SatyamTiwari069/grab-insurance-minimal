import { useState, useEffect, useCallback } from "react";
import "./App.css";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════
interface Deal {
  merchantName: string;
  category: "Travel" | "Electronics" | "Health" | "Food" | "Fashion & Beauty";
  subcategory: string;
  dealValue: number;
  riskTier?: "low" | "medium" | "high";
}

interface ABTestResult {
  productId: string;
  productName: string;
  coverage: string;
  premium: number;
  copy_A: string;
  copy_B: string;
  copy_C: string;
  selectedVariant: "A" | "B" | "C";
  selectedCopy: string;
  confidence: number;
}

interface ConversionEvent {
  sessionId: string;
  dealId: string;
  productId: string;
  productName: string;
  category: string;
  variant: "variant_A" | "variant_B" | "variant_C";
  premium: number;
  dealValue: number;
  timestamp: number;
  userRiskProfile: string;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════
const MOCK_DEALS: Deal[] = [
  { merchantName: "Emirates Airline",  category: "Travel",           subcategory: "Flight",    dealValue: 45000, riskTier: "high"   },
  { merchantName: "Club Mahindra",     category: "Travel",           subcategory: "Hotel",     dealValue: 8500,  riskTier: "medium" },
  { merchantName: "Apple Store",       category: "Electronics",      subcategory: "iPhone",    dealValue: 79999, riskTier: "high"   },
  { merchantName: "Sony",              category: "Electronics",      subcategory: "Headphones",dealValue: 12999, riskTier: "low"    },
  { merchantName: "Max Healthcare",    category: "Health",           subcategory: "Diagnosis", dealValue: 3000,  riskTier: "low"    },
  { merchantName: "Apollo Pharmacy",   category: "Health",           subcategory: "Medicine",  dealValue: 1500,  riskTier: "low"    },
  { merchantName: "Zomato Premium",    category: "Food",             subcategory: "Delivery",  dealValue: 500,   riskTier: "low"    },
  { merchantName: "Swiggy Instamart",  category: "Food",             subcategory: "Grocery",   dealValue: 1200,  riskTier: "medium" },
  { merchantName: "H&M India",         category: "Fashion & Beauty", subcategory: "Apparel",   dealValue: 3499,  riskTier: "low"    },
  { merchantName: "Nykaa",             category: "Fashion & Beauty", subcategory: "Beauty",    dealValue: 2999,  riskTier: "low"    },
];

const CATEGORY_ICONS: Record<string, string> = {
  "Travel": "✈️", "Electronics": "📱", "Health": "💊", "Food": "🍽️", "Fashion & Beauty": "👗",
};

const INSURANCE_CATALOG = [
  { id: "travel-cancel",        name: "Travel Cancellation",         icon: "✈️",  coverage: "Full trip cancellation + rebooking",        description: "Covers unexpected cancellations, medical emergencies, and family issues", categories: ["Travel"],                         minPremium: 89,  maxPremium: 299 },
  { id: "travel-medical",       name: "Travel Medical",              icon: "🏥",  coverage: "Medical expenses up to ₹5 lakhs",           description: "Emergency medical treatment, evacuation, and repatriation coverage",     categories: ["Travel"],                         minPremium: 199, maxPremium: 499 },
  { id: "electronics-warranty", name: "Electronics Extended Warranty",icon: "🔧", coverage: "5-year device protection",                  description: "Device malfunction, hardware damage, and accidental protection",          categories: ["Electronics"],                    minPremium: 299, maxPremium: 999 },
  { id: "screen-damage",        name: "Screen Damage Cover",         icon: "📱",  coverage: "Unlimited screen replacements",             description: "Covers accidental screen damage with free repair for 3 years",           categories: ["Electronics"],                    minPremium: 99,  maxPremium: 249 },
  { id: "personal-accident",    name: "Personal Accident Cover",     icon: "🛡️",  coverage: "Accident coverage ₹10 lakhs",               description: "Covers accidental injury, disability, and hospitalization",              categories: ["Food", "Travel", "Fashion & Beauty"], minPremium: 49, maxPremium: 149 },
  { id: "health-opd",           name: "Health OPD Cover",            icon: "💊",  coverage: "Out-patient treatment up to ₹1 lakh",       description: "Diagnostic tests, consultations, and OPD procedures coverage",           categories: ["Health"],                         minPremium: 199, maxPremium: 599 },
  { id: "return-journey",       name: "Return Journey Protection",   icon: "🚆",  coverage: "Travel delay or missed connection",         description: "Coverage for delayed flights, missed connections, and stranded passengers",categories: ["Travel"],                       minPremium: 69,  maxPremium: 199 },
  { id: "purchase-protection",  name: "Purchase Protection",         icon: "🎁",  coverage: "Product loss, theft, and damage",           description: "Comprehensive coverage for purchased items up to their full value",       categories: ["Electronics", "Fashion & Beauty", "Food"], minPremium: 129, maxPremium: 449 },
];

// ═══════════════════════════════════════════════════════════════
// API
// ═══════════════════════════════════════════════════════════════
const API = "http://localhost:8000/api";

async function apiGetRecommendations(deal: Deal, sessionId: string): Promise<ABTestResult[]> {
  const res = await fetch(`${API}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deal, sessionId }),
  });
  const data = await res.json();
  if (!data.success) throw new Error("Recommendation failed");
  const variant = data.variant.replace("variant_", "") as "A" | "B" | "C";
  return data.recommendations.map((rec: any) => ({
    productId: rec.product.id,
    productName: rec.product.name,
    coverage: rec.product.coverage,
    premium: rec.premium,
    copy_A: rec.copy.variant_A,
    copy_B: rec.copy.variant_B,
    copy_C: rec.copy.variant_C,
    selectedVariant: variant,
    selectedCopy: rec.activeCopy,
    confidence: rec.confidence,
  }));
}

async function apiTrackConversion(event: ConversionEvent): Promise<void> {
  try {
    await fetch(`${API}/conversion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
  } catch { /* silent */ }
}

async function apiGetAnalytics(): Promise<any> {
  try {
    const res = await fetch(`${API}/analytics`);
    return await res.json();
  } catch { return null; }
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function formatINR(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000)   return `₹${(v / 1000).toFixed(0)}K`;
  return `₹${v}`;
}

function getProductIcon(productId: string): string {
  const catalog = INSURANCE_CATALOG.find(p => p.id === productId);
  if (catalog) return catalog.icon;
  const iconMap: Record<string, string> = {
    travel_cancel: "✈️", travel_medical: "🏥", electronics_warranty: "🔧",
    screen_damage: "📱", personal_accident: "🛡️", health_opd: "💊",
    return_protection: "↩️", purchase_protection: "🎁",
  };
  return iconMap[productId] || "🛡️";
}

function variantLabel(v: string) {
  const key = v.replace("variant_", "");
  if (key === "A") return "A · Direct";
  if (key === "B") return "B · Emotional";
  if (key === "C") return "C · Social Proof";
  return key;
}

// ═══════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState<"simulator" | "storefront" | "analytics">("simulator");
  const [sessionId] = useState(`sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);

  return (
    <div className="app">
      <header className="header">
        <div className="header__left">
          <img src="/logo.svg" alt="GrabOn" className="header__logo" />
          <span className="header__brand-name">GrabInsurance</span>
          <span className="header__brand-tag">Embedded Insurance</span>
        </div>

        <nav className="header__nav">
          {(["simulator", "storefront", "analytics"] as const).map(t => (
            <button key={t} className={`nav__item ${tab === t ? "nav__item--active" : ""}`} onClick={() => setTab(t)}>
              {t === "simulator"  && <>{ICON_SIMULATOR}  Deal Simulator</>}
              {t === "storefront" && <>{ICON_STORE}       Storefront</>}
              {t === "analytics"  && <>{ICON_ANALYTICS}   Analytics</>}
            </button>
          ))}
        </nav>

        <div className="header__right">
          <div className="session-badge">
            <span className="session-badge__dot" />
            {sessionId.slice(0, 16)}…
          </div>
        </div>
      </header>

      <main className="main">
        {tab === "simulator"  && <SimulatorTab  sessionId={sessionId} />}
        {tab === "storefront" && <StorefrontTab />}
        {tab === "analytics"  && <AnalyticsTab />}
      </main>

      <footer className="footer">
        <span>GrabInsurance · Embedded Insurance Platform · GrabOn Vibe Coder Challenge 2025</span>
        <span>Intent Classification · A/B Testing · MCP Server · Claude AI</span>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SIMULATOR TAB
// ═══════════════════════════════════════════════════════════════
function SimulatorTab({ sessionId }: { sessionId: string }) {
  const [selectedIdx, setSelectedIdx]   = useState(0);
  const [recs, setRecs]                 = useState<ABTestResult[] | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [purchased, setPurchased]       = useState<ABTestResult | null>(null);

  const deal = MOCK_DEALS[selectedIdx];

  const getRecs = useCallback(async () => {
    setLoading(true);
    setError("");
    setRecs(null);
    setPurchased(null);
    try {
      setRecs(await apiGetRecommendations(deal, sessionId));
    } catch {
      setError("Could not reach backend. Make sure the server is running on :8000");
    }
    setLoading(false);
  }, [deal, sessionId]);

  const purchase = async (rec: ABTestResult) => {
    await apiTrackConversion({
      sessionId,
      dealId: `deal_${selectedIdx}`,
      productId: rec.productId,
      productName: rec.productName,
      category: deal.category,
      variant: `variant_${rec.selectedVariant}` as any,
      premium: rec.premium,
      dealValue: deal.dealValue,
      timestamp: Date.now(),
      userRiskProfile: deal.riskTier || "medium",
    });
    setPurchased(rec);
  };

  const selectDeal = (i: number) => {
    setSelectedIdx(i);
    setRecs(null);
    setPurchased(null);
    setError("");
  };

  return (
    <>
      <div className="page-header">
        <h1>Deal Simulator</h1>
        <p>Select a deal to get contextual insurance recommendations powered by the MCP classification engine</p>
      </div>

      <div className="simulator-layout">
        {/* Left — Deal Picker */}
        <div className="panel">
          <div className="panel__header">
            <span className="panel__title">
              <span className="panel__title-icon">🏪</span>
              Active Deals
            </span>
            <span className="panel__badge">{MOCK_DEALS.length}</span>
          </div>
          <div className="panel__body">
            <div className="deal-list">
              {MOCK_DEALS.map((d, i) => (
                <button
                  key={i}
                  className={`deal-item ${selectedIdx === i ? "deal-item--active" : ""}`}
                  onClick={() => selectDeal(i)}
                >
                  <div className="deal-item__icon">{CATEGORY_ICONS[d.category]}</div>
                  <div className="deal-item__info">
                    <div className="deal-item__name">{d.merchantName}</div>
                    <div className="deal-item__sub">{d.subcategory} · {d.category}</div>
                  </div>
                  <div className="deal-item__value">{formatINR(d.dealValue)}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Deal Detail + Recommendations */}
        <div className="deal-info">
          {/* Deal Hero */}
          <div className="deal-hero">
            <div className="deal-hero__icon">{CATEGORY_ICONS[deal.category]}</div>
            <div className="deal-hero__info">
              <div className="deal-hero__merchant">{deal.merchantName}</div>
              <div className="deal-hero__sub">{deal.subcategory}</div>
              <div className="deal-hero__value">{formatINR(deal.dealValue)}</div>
              <div className="deal-hero__meta">
                <span className="chip chip--white">{deal.category}</span>
                <span className={`chip chip--risk-${deal.riskTier}`}>
                  {deal.riskTier === "high" ? "⬆" : deal.riskTier === "medium" ? "➡" : "⬇"} {deal.riskTier} risk
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button className="cta-btn" onClick={getRecs} disabled={loading}>
            {loading ? <><span className="spinner" />Analyzing deal…</> : <>{ICON_MAGIC} Get Insurance Recommendations</>}
          </button>

          {error && <div className="error-banner">{ICON_WARN} {error}</div>}

          {/* Recommendations */}
          {recs && (
            <>
              <div className="recs-header">
                <span className="recs-header__label">
                  {recs.length} products matched for <strong>{deal.category}</strong>
                </span>
                <span className="recs-header__reasoning">
                  Serving Variant {recs[0]?.selectedVariant} this session
                </span>
              </div>

              <div className="rec-cards">
                {recs.map((rec, idx) => (
                  <RecCard
                    key={idx}
                    rec={rec}
                    isPrimary={idx === 0}
                    onPurchase={() => purchase(rec)}
                    purchased={purchased?.productId === rec.productId}
                  />
                ))}
              </div>
            </>
          )}

          {/* Purchase Toast */}
          {purchased && (
            <div className="purchase-toast">
              <div className="purchase-toast__icon">✓</div>
              <div>
                <div className="purchase-toast__title">Insurance added successfully</div>
                <div className="purchase-toast__sub">
                  {purchased.productName} · ₹{purchased.premium}/year · Variant {purchased.selectedVariant} tracked
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Rec Card ───
function RecCard({ rec, isPrimary, onPurchase, purchased }: {
  rec: ABTestResult;
  isPrimary: boolean;
  onPurchase: () => void;
  purchased: boolean;
}) {
  return (
    <div className={`rec-card ${isPrimary ? "rec-card--primary" : "rec-card--secondary"}`}>
      <div className="rec-card__top">
        <div className="rec-card__product">
          <div className="rec-card__icon">{getProductIcon(rec.productId)}</div>
          <div className="rec-card__meta">
            <div className="rec-card__badge">{isPrimary ? "Top Recommendation" : "Also Consider"}</div>
            <div className="rec-card__name">{rec.productName}</div>
            <div className="rec-card__coverage">{rec.coverage}</div>
          </div>
        </div>
        <div className="rec-card__pricing">
          <div className="rec-card__premium">₹{rec.premium}</div>
          <div className="rec-card__per-year">/year</div>
          <div className="rec-card__confidence">
            {ICON_CHECK} {Math.round(rec.confidence * 100)}% match
          </div>
        </div>
      </div>

      {/* Active copy */}
      <div className="copy-pill">"{rec.selectedCopy}"</div>

      {/* A/B variants */}
      <div className="ab-section">
        <div className="ab-section__header">
          <span className="ab-section__label">A/B Copy Variants</span>
          <span className="ab-section__active">Showing Variant {rec.selectedVariant}</span>
        </div>
        <div className="ab-variants">
          {(["A", "B", "C"] as const).map(v => {
            const text = v === "A" ? rec.copy_A : v === "B" ? rec.copy_B : rec.copy_C;
            const isActive = v === rec.selectedVariant;
            return (
              <div key={v} className={`ab-variant ${isActive ? "ab-variant--active" : ""}`}>
                <span className="ab-variant__tag">{v}</span>
                <span className="ab-variant__text">{text}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rec-card__footer">
        <button className={`buy-btn ${purchased ? "buy-btn--secondary" : ""}`} onClick={onPurchase} disabled={purchased}>
          {purchased ? <>{ICON_CHECK} Added</> : <>{ICON_CART} Purchase Insurance</>}
        </button>
        <div style={{ fontSize: 11, color: "var(--text-3)" }}>
          No medical exam · Instant cover
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STOREFRONT TAB
// ═══════════════════════════════════════════════════════════════
function StorefrontTab() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Travel", "Electronics", "Health", "Food", "Fashion & Beauty"];
  const filtered = filter === "All"
    ? INSURANCE_CATALOG
    : INSURANCE_CATALOG.filter(p => p.categories.includes(filter));

  return (
    <>
      <div className="page-header">
        <h1>Insurance Storefront</h1>
        <p>8 micro-insurance products designed for GrabOn deal categories — embeddable at checkout</p>
      </div>

      <div className="filter-bar">
        {categories.map(c => (
          <button
            key={c}
            className={`filter-pill ${filter === c ? "filter-pill--active" : ""}`}
            onClick={() => setFilter(c)}
          >
            {c !== "All" && CATEGORY_ICONS[c]} {c}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filtered.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-card__top">
              <div className="product-card__icon">{product.icon}</div>
              <div className="product-card__price">
                <div className="product-card__price-from">From</div>
                <div className="product-card__price-value">₹{product.minPremium}</div>
                <div className="product-card__price-unit">/year</div>
              </div>
            </div>
            <div>
              <div className="product-card__name">{product.name}</div>
              <div className="product-card__coverage">{product.coverage}</div>
            </div>
            <div className="product-card__desc">{product.description}</div>
            <div className="product-card__footer">
              {product.categories.map(c => (
                <span key={c} className="cat-badge">{CATEGORY_ICONS[c]} {c}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// ANALYTICS TAB
// ═══════════════════════════════════════════════════════════════
function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    apiGetAnalytics().then(d => { setAnalytics(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="empty-state">
      <div className="spinner" style={{ borderTopColor: "var(--primary)", width: 28, height: 28, borderWidth: 3 }} />
    </div>
  );

  const conversions: any[] = analytics?.recentConversions || analytics?.conversions || [];
  const total    = analytics?.totalConversions || 0;
  const revenue  = analytics?.totalRevenue     || 0;
  const sessions = analytics?.totalSessions    || 0;
  const rate     = analytics?.conversionRate   || "0.0";
  const avg      = analytics?.avgPremium       || 0;

  const variantData = analytics?.variantStats || {};
  const variantList = [
    { key: "variant_A", label: "Variant A", type: "Direct / Value",       count: variantData.variant_A?.conversions || 0, revenue: variantData.variant_A?.revenue || 0 },
    { key: "variant_B", label: "Variant B", type: "Emotional / Fear",     count: variantData.variant_B?.conversions || 0, revenue: variantData.variant_B?.revenue || 0 },
    { key: "variant_C", label: "Variant C", type: "Social Proof",         count: variantData.variant_C?.conversions || 0, revenue: variantData.variant_C?.revenue || 0 },
  ];
  const maxVariantCount = Math.max(...variantList.map(v => v.count), 1);

  const catRevenue: Record<string, number> = analytics?.categoryRevenue || {};

  return (
    <>
      <div className="page-header">
        <h1>Conversion Analytics</h1>
        <p>Real-time A/B testing results, session tracking, and revenue breakdown</p>
      </div>

      {/* KPIs */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-card__label">Total Sessions</div>
          <div className="kpi-card__value">{sessions}</div>
          <div className="kpi-card__sub">Unique user sessions</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card__label">Conversions</div>
          <div className="kpi-card__value">{total}</div>
          <div className="kpi-card__sub">Insurance purchases</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card__label">Conversion Rate</div>
          <div className="kpi-card__value">{rate}%</div>
          <div className="kpi-card__sub">Sessions → purchases</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card__label">Total Revenue</div>
          <div className="kpi-card__value">{formatINR(revenue)}</div>
          <div className="kpi-card__sub">Avg ₹{avg}/conversion</div>
        </div>
      </div>

      {total === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📊</div>
          <h3>No conversions yet</h3>
          <p>Go to Deal Simulator, select a deal, and click "Purchase Insurance" to generate data.</p>
        </div>
      ) : (
        <div className="analytics-grid">
          {/* A/B Performance */}
          <div className="analytics-card">
            <div className="analytics-card__header">
              <span className="analytics-card__title">A/B Variant Performance</span>
              <span className="analytics-card__sub">{total} total conversions</span>
            </div>
            <div className="analytics-card__body">
              <div className="variant-bars">
                {variantList.map(v => (
                  <div key={v.key} className="vbar">
                    <div className="vbar__label">
                      <div className="vbar__name">{v.label}</div>
                      <div className="vbar__type">{v.type}</div>
                    </div>
                    <div className="vbar__track">
                      <div className="vbar__fill" style={{ width: `${(v.count / maxVariantCount) * 100}%` }} />
                    </div>
                    <div className="vbar__count">{v.count}</div>
                    <div className="vbar__pct">{total > 0 ? Math.round((v.count / total) * 100) : 0}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Revenue */}
          <div className="analytics-card">
            <div className="analytics-card__header">
              <span className="analytics-card__title">Revenue by Category</span>
              <span className="analytics-card__sub">₹{revenue.toLocaleString("en-IN")} total</span>
            </div>
            <div className="analytics-card__body">
              <div className="cat-list">
                {Object.entries(catRevenue)
                  .sort((a: any, b: any) => b[1] - a[1])
                  .map(([cat, rev]: [string, any]) => (
                    <div key={cat} className="cat-row">
                      <span className="cat-row__name">{CATEGORY_ICONS[cat] || "📦"} {cat}</span>
                      <span className="cat-row__count">₹{rev.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Recent Conversions */}
          <div className="analytics-card analytics-card--full">
            <div className="analytics-card__header">
              <span className="analytics-card__title">Recent Conversions</span>
              <span className="analytics-card__sub">Last {Math.min(conversions.length, 10)}</span>
            </div>
            <div className="analytics-card__body">
              <div className="conv-table">
                {conversions.slice(-10).reverse().map((c: any, i: number) => {
                  const variantKey = (c.variant || "").replace("variant_", "") as "A" | "B" | "C";
                  return (
                    <div key={i} className="conv-row">
                      <div className="conv-row__left">
                        <div className="conv-row__icon">{getProductIcon(c.productId)}</div>
                        <div>
                          <div className="conv-row__product">{c.productName || c.productId}</div>
                          <div className="conv-row__meta">
                            {CATEGORY_ICONS[c.category] || "📦"} {c.category}
                            {c.merchantName ? ` · ${c.merchantName}` : ""}
                          </div>
                        </div>
                      </div>
                      <div className="conv-row__right">
                        <div className="conv-row__premium">₹{c.premium}</div>
                        {variantKey && (
                          <span className={`variant-tag variant-tag--${variantKey}`}>
                            {variantLabel(c.variant)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// INLINE SVG ICONS (no dependencies)
// ═══════════════════════════════════════════════════════════════
const ICON_SIMULATOR = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);
const ICON_STORE = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const ICON_ANALYTICS = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const ICON_MAGIC = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const ICON_WARN = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const ICON_CHECK = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ICON_CART = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
