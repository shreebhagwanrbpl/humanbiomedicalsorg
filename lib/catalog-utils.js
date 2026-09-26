export const ADMIN_API_BASE_URL =
  process.env.ADMIN_API_BASE_URL ||
  process.env.ADMIN_API_URL ||
  process.env.SQLITE_ADMIN_API_URL ||
  "https://admin.rajbiosis.app";

/**
 * Domain normalization helper:
 * Strips protocols, www, dots, hyphens, underscores, spaces and lowercases so domain variations match cleanly.
 * e.g. "https://www.humanbiomedicals.org/", "humanbiomedicals.org", "humanbiomedicalsorg" -> "humanbiomedicalsorg"
 */
export function normalizeDomainId(id = "") {
  return String(id || "")
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/[^a-z0-9]/g, "");
}

export const RAW_WEBSITE_ID =
  process.env.NEXT_PUBLIC_WEBSITE_ID ||
  process.env.WEBSITE_ID ||
  "humanbiomedicalsorg";

export const WEBSITE_ID = normalizeDomainId(RAW_WEBSITE_ID);

/**
 * Automatically detect company based on website ID / domain / environment
 */
export function detectCompanyId(websiteId = WEBSITE_ID) {
  const norm = normalizeDomainId(websiteId);
  if (norm.includes("global")) return "global";
  if (norm.includes("rajbiosis")) return "rajbiosis";
  return "human";
}

export const PRIMARY_COMPANY = detectCompanyId(WEBSITE_ID);
export const ALL_COMPANIES = ["human", "global", "rajbiosis"];

export const makeSlug = (text = "") =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

/**
 * Bulletproof Visibility Logic:
 * 1. item.isPublished === false -> Hide (false)
 * 2. item.status === "inactive" / "draft" -> Hide (false)
 * 3. item.websiteIds is [] (0 websites selected / access removed) -> Hide (false)
 * 4. item.websiteIds.includes("all") -> Show (true)
 * 5. Normalized matching: Matches current website domain against selected websites in Admin.
 */
export function isItemVisibleOnWebsite(item, targetWebsiteId = WEBSITE_ID) {
  if (!item || typeof item !== "object") return false;

  // 1. Explicit publish and status check (Admin Eye icon and status toggle)
  if (item.isPublished === false) return false;
  if (item.status === "inactive" || item.status === "draft") return false;

  // 2. websiteIds array check (Admin Website Visibility Selector)
  const rawWebsites = item.websiteIds;
  const targetNorm = normalizeDomainId(targetWebsiteId);

  // If websiteIds is an array
  if (Array.isArray(rawWebsites)) {
    // Empty array ([] with 0 websites selected) -> instant hide (access removed)
    if (rawWebsites.length === 0) {
      return false;
    }

    // Check if "all" is present or matches target website domain
    return rawWebsites.some((w) => {
      const norm = normalizeDomainId(w);
      if (!norm) return false;
      if (norm === "all") return true;
      return norm === targetNorm;
    });
  }

  // 3. Fallback check for legacy singular websiteId field
  if (item.websiteId) {
    const normItem = normalizeDomainId(item.websiteId);
    return normItem === "all" || normItem === targetNorm;
  }

  // If no website restrictions are explicitly set, default to true
  return true;
}

export const isVisibleOnWebsite = isItemVisibleOnWebsite;

/**
 * Normalize product fields into a consistent schema
 */
export function normalizeProduct(raw = {}, defaultCategory = "", defaultSubCategory = "", index = 0) {
  const title = (raw.title || raw.name || "Untitled Product").trim();
  const slug = raw.slug || makeSlug(title);

  // Extract images array
  let images = [];
  if (Array.isArray(raw.images) && raw.images.length > 0) {
    images = raw.images.filter(Boolean);
  } else if (raw.image) {
    images = [raw.image];
  } else if (Array.isArray(raw.originalImages) && raw.originalImages.length > 0) {
    images = raw.originalImages.filter(Boolean);
  }

  const category = raw.category || defaultCategory || (raw.type === "normal" ? "Other Products" : "General");
  const subCategory = raw.subCategory || raw.subcategory || defaultSubCategory || (category === "Other Products" ? "Other Products" : "General");
  const categoryId = raw.categoryId || makeSlug(category);
  const subcategoryId = raw.subcategoryId || makeSlug(subCategory);

  const rawId = raw.id || raw.productId || raw.categoryProductId || slug;
  const uniqueUid = `${categoryId}-${subcategoryId}-${rawId}-${index}`.replace(/[^a-zA-Z0-9-_]/g, "-");

  return {
    id: rawId,
    uid: raw.uid || uniqueUid,
    productId: raw.productId || raw.categoryProductId || raw.id || "",
    categoryProductId: raw.categoryProductId || raw.productId || raw.id || "",
    title,
    name: title,
    slug,
    price: raw.price ? String(raw.price).trim() : "",
    desc: raw.desc || raw.description || "",
    description: raw.description || raw.desc || "",
    brand: raw.brand ? String(raw.brand).trim() : "",
    model: raw.model ? String(raw.model).trim() : "",
    capacity: raw.capacity ? String(raw.capacity).trim() : "",
    throughput: raw.throughput ? String(raw.throughput).trim() : "",
    instrument: raw.instrument ? String(raw.instrument).trim() : "",
    usage: raw.usage ? String(raw.usage).trim() : "",
    parameters: raw.parameters ? String(raw.parameters).trim() : "",
    automation: raw.automation ? String(raw.automation).trim() : "",
    availability: raw.availability ? String(raw.availability).trim() : "",
    size: raw.size ? String(raw.size).trim() : "",
    images,
    image: images[0] || "",
    video: raw.video || "",
    pdf: raw.pdf || "",
    category,
    subCategory,
    categoryId,
    subcategoryId,
    isPublished: raw.isPublished !== false && raw.status !== "inactive" && raw.status !== "draft",
    websiteIds: Array.isArray(raw.websiteIds) ? raw.websiteIds : ["all"],
    type: raw.type || (category && category !== "Other Products" ? "category" : "normal"),
    createdAt: raw.createdAt || "",
    updatedAt: raw.updatedAt || "",
  };
}
