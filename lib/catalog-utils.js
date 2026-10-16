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

  // Intelligent Fallback & Clinical Spec Inference
  const titleLower = title.toLowerCase();

  // 1. Brand inference
  let brand = raw.brand ? String(raw.brand).trim() : "";
  if (!brand) {
    if (titleLower.includes("quik-check") || titleLower.includes("quick-check") || titleLower.includes("acon")) {
      brand = "ACON / QUIK-CHECK";
    } else if (titleLower.includes("hemocue")) {
      brand = "HemoCue®";
    } else if (titleLower.includes("dolphin")) {
      brand = "Dolphin";
    } else if (titleLower.includes("sensacore") || titleLower.includes("gluco spark") || titleLower.includes("glucospark")) {
      brand = "SensaCore / GlucoSpark";
    } else if (titleLower.includes("sd biosensor") || titleLower.includes("gluconavii") || titleLower.includes("codefree")) {
      brand = "SD Biosensor";
    } else if (titleLower.includes("morepen")) {
      brand = "Dr. Morepen";
    } else if (titleLower.includes("arkray")) {
      brand = "ARKRAY";
    } else if (titleLower.includes("siemens") || titleLower.includes("multistix") || titleLower.includes("uristix")) {
      brand = "Siemens";
    } else if (titleLower.includes("dirui")) {
      brand = "DIRUI";
    } else if (titleLower.includes("urit")) {
      brand = "URIT";
    } else if (titleLower.includes("oscar")) {
      brand = "OSCAR";
    } else if (titleLower.includes("cinmera") || titleLower.includes("clinera")) {
      brand = "CINMERA / Clinera";
    } else if (titleLower.includes("pratham")) {
      brand = "Pratham";
    } else if (titleLower.includes("healline")) {
      brand = "HEALLINE";
    } else if (titleLower.includes("himedia")) {
      brand = "HiMedia";
    } else if (titleLower.includes("bioway") || titleLower.includes("finova")) {
      brand = "BIOWAY / Finova";
    } else {
      brand = "Human Biomedicals";
    }
  }

  // 2. Model inference
  let model = raw.model ? String(raw.model).trim() : "";
  if (!model) {
    if (raw.categoryProductId) {
      model = raw.categoryProductId;
    } else {
      model = `${brand} Standard Series`;
    }
  }

  // 3. Instrument inference
  let instrument = raw.instrument ? String(raw.instrument).trim() : "";
  if (!instrument) {
    if (category.toLowerCase().includes("strip") || subCategory.toLowerCase().includes("strip")) {
      instrument = "Point-of-Care Meter / Rapid Optical Analyzer";
    } else if (category.toLowerCase().includes("analyzer") || subCategory.toLowerCase().includes("analyzer")) {
      instrument = "Automated Clinical Diagnostic Analyzer";
    } else {
      instrument = "Clinical Diagnostic Platform";
    }
  }

  // 4. Capacity & Size
  let size = raw.size ? String(raw.size).trim() : "";
  let capacity = raw.capacity ? String(raw.capacity).trim() : size;
  if (!capacity) {
    if (titleLower.includes("50")) {
      capacity = "50 Tests / Box";
    } else if (titleLower.includes("100")) {
      capacity = "100 Tests / Box";
    } else if (titleLower.includes("200")) {
      capacity = "200 Tests / Box";
    } else {
      capacity = "Standard Diagnostic Pack";
    }
  }

  // 5. Throughput
  let throughput = raw.throughput ? String(raw.throughput).trim() : "";
  if (!throughput) {
    throughput = "Rapid (~15-60 sec / test)";
  }

  // 6. Usage
  let usage = raw.usage ? String(raw.usage).trim() : "";
  if (!usage) {
    usage = "Hospitals, Pathology Laboratories, Diagnostic Centers & Clinics";
  }

  // 7. Parameters
  let parameters = raw.parameters ? String(raw.parameters).trim() : "";
  if (!parameters) {
    if (subCategory.toLowerCase().includes("hemoglobin")) {
      parameters = "Hemoglobin (Hb), Hematocrit";
    } else if (subCategory.toLowerCase().includes("glucose")) {
      parameters = "Blood Glucose";
    } else if (subCategory.toLowerCase().includes("urine")) {
      parameters = "Routine Urinalysis Parameters";
    } else {
      parameters = subCategory || category;
    }
  }

  // 8. Automation
  let automation = raw.automation ? String(raw.automation).trim() : "";
  if (!automation) {
    automation = "Semi-Automated / POC";
  }

  // 9. Availability
  let availability = raw.availability ? String(raw.availability).trim() : "In Stock (PAN-India Delivery)";

  // 10. Description
  let desc = raw.desc || raw.description || "";
  if (!desc) {
    desc = `Premium clinical grade ${title} supplied by Human Biomedicals LLP. Designed for high accuracy diagnostic testing in hospitals, pathology labs and healthcare clinics across India.`;
  }

  return {
    id: rawId,
    uid: raw.uid || uniqueUid,
    productId: raw.productId || raw.categoryProductId || raw.id || "",
    categoryProductId: raw.categoryProductId || raw.productId || raw.id || "",
    title,
    name: title,
    slug,
    price: raw.price ? String(raw.price).trim() : "",
    desc,
    description: desc,
    brand,
    model,
    capacity,
    throughput,
    instrument,
    usage,
    parameters,
    automation,
    availability,
    size: size || capacity,
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
