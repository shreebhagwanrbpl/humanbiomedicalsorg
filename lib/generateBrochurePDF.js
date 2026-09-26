import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function resolveImageUrl(img) {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (typeof img === "object" && img !== null) {
    return img.url || img.src || img.link || img.secure_url || img.path || "";
  }
  return "";
}

export function createFallbackProductSvg(title = "Medical Product") {
  const cleanTitle = title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const displayTitle = cleanTitle.length > 32 ? cleanTitle.slice(0, 30) + "..." : cleanTitle;
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="#f8fafc"/>
    <rect x="15" y="15" width="370" height="270" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <circle cx="200" cy="110" r="42" fill="#e0f2fe"/>
    <path d="M185 110h30M200 95v30" stroke="#0284c7" stroke-width="6" stroke-linecap="round"/>
    <text x="200" y="180" font-family="'Segoe UI', Roboto, Arial, sans-serif" font-size="15" font-weight="bold" fill="#0f172a" text-anchor="middle">${displayTitle}</text>
    <text x="200" y="205" font-family="'Segoe UI', Roboto, Arial, sans-serif" font-size="12" font-weight="700" fill="#0284c7" text-anchor="middle">HUMAN BIOMEDICALS LLP</text>
    <text x="200" y="225" font-family="'Segoe UI', Roboto, Arial, sans-serif" font-size="11" fill="#64748b" text-anchor="middle">Official Equipment Brochure</text>
  </svg>`;
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}

export function getProductMainImage(product) {
  if (!product) return "";
  
  // Check array of images
  if (Array.isArray(product.images) && product.images.length > 0) {
    for (const item of product.images) {
      const resolved = resolveImageUrl(item);
      if (resolved) return resolved;
    }
  }
  // Check singular image properties
  const keys = ["image", "productImage", "img", "photo", "picture", "imageUrl", "thumbnail", "cover"];
  for (const k of keys) {
    if (product[k]) {
      const resolved = resolveImageUrl(product[k]);
      if (resolved) return resolved;
    }
  }
  return "";
}

export function deriveProductDetails(product) {
  if (!product) return { brand: "N/A", model: "N/A", instrument: "Medical Equipment", usage: "Clinical Laboratory", automation: "Automatic", capacity: "Standard", availability: "In Stock" };
  
  const title = product.title || "";
  let brand = product.brand || "";
  let model = product.model || "";

  // Extract brand if missing
  if (!brand) {
    const knownBrands = [
      "Abbott", "Erba", "Roche", "Mindray", "Horiba", "Agappe", "Sysmex", "Biomerieux", "Biorad", "HD Consortium", "Meril", "Teco", "Transasia"
    ];
    for (const b of knownBrands) {
      if (new RegExp(`\\b${b}\\b`, "i").test(title)) {
        brand = b;
        break;
      }
    }
  }

  // Extract model if missing
  if (!model) {
    const modelMatch = title.match(/(?:model|no\.?|name\/number)?:?\s*([A-Z0-9]{2,}(?:-[A-Z0-9]+)*(?:\s+Plus)?)/i) ||
                       title.match(/\b(\d+\s*Part)\b/i);
    if (modelMatch) {
      model = modelMatch[1] || "";
    }
  }

  return {
    brand: brand || "Human Biomedicals",
    model: model || "N/A",
    instrument: product.instrument || product.subCategory || product.category || "Medical Analyzer",
    usage: product.usage || "Clinical Laboratory & Hospital",
    automation: product.automation || (title.toLowerCase().includes("automatic") || title.toLowerCase().includes("automated") ? "Fully Automatic" : "Semi / Fully Automated"),
    capacity: product.capacity || product.throughput || "Standard",
    availability: product.availability || "In Stock",
  };
}

/**
 * Robust multi-tier Base64 converter bypassing Firebase Storage CORS issues
 */
async function loadBase64FromUrlOrDom(url, title = "Medical Product") {
  if (!url) {
    if (typeof document !== "undefined") {
      const domImgs = Array.from(document.querySelectorAll("img"));
      const foundImg = domImgs.find((img) => img.naturalWidth > 50 && img.src && !img.src.includes("logo") && !img.src.includes("svg"));
      if (foundImg && foundImg.src) {
        url = foundImg.src;
      }
    }
  }

  if (!url) return createFallbackProductSvg(title);
  if (url.startsWith("data:image")) return url;

  // Tier 1: Direct CORS fetch
  try {
    const response = await fetch(url, { mode: "cors" });
    if (response.ok) {
      const blob = await response.blob();
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => resolve("");
        reader.readAsDataURL(blob);
      });
      if (dataUrl && dataUrl.startsWith("data:image")) return dataUrl;
    }
  } catch (err) {
    console.warn("Tier 1 direct fetch failed:", err);
  }

  // Tier 2: Proxy via images.weserv.nl (bypasses Firebase CORS headers)
  try {
    const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}&output=png`;
    const response = await fetch(proxyUrl);
    if (response.ok) {
      const blob = await response.blob();
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => resolve("");
        reader.readAsDataURL(blob);
      });
      if (dataUrl && dataUrl.startsWith("data:image")) return dataUrl;
    }
  } catch (err) {
    console.warn("Tier 2 weserv proxy failed:", err);
  }

  // Tier 3: Proxy via corsproxy.io
  try {
    const proxyUrl2 = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl2);
    if (response.ok) {
      const blob = await response.blob();
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => resolve("");
        reader.readAsDataURL(blob);
      });
      if (dataUrl && dataUrl.startsWith("data:image")) return dataUrl;
    }
  } catch (err) {
    console.warn("Tier 3 corsproxy failed:", err);
  }

  // Tier 4: DOM canvas capture
  if (typeof document !== "undefined") {
    const domImgs = Array.from(document.querySelectorAll("img"));
    const matchingDomImg = domImgs.find((img) => 
      img.complete && img.naturalWidth > 0 && 
      (img.src === url || (url && img.src && img.src.includes(url.split("?")[0])))
    );

    if (matchingDomImg) {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = matchingDomImg.naturalWidth;
        canvas.height = matchingDomImg.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(matchingDomImg, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        if (dataUrl && dataUrl.startsWith("data:image")) return dataUrl;
      } catch (e) {
        console.warn("Tier 4 canvas capture failed:", e);
      }
    }
  }

  return createFallbackProductSvg(title);
}

export async function generateBrochurePDF(product, currentSelectedImage = "") {
  if (!product || typeof window === "undefined") return;

  const specs = deriveProductDetails(product);
  let rawImg = resolveImageUrl(currentSelectedImage) || getProductMainImage(product);
  
  // If rawImg is empty, attempt to grab main product image from active DOM
  if (!rawImg) {
    const domImg = document.querySelector(".relative img[src*='http']") || document.querySelector("img[src*='firebasestorage']");
    if (domImg && domImg.src) {
      rawImg = domImg.src;
    }
  }

  const imageSrc = await loadBase64FromUrlOrDom(rawImg, product.title);

  // Create temporary container for rendering
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "800px";
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#1e293b";
  container.style.fontFamily = "'Segoe UI', Roboto, Arial, sans-serif";
  container.style.boxSizing = "border-box";
  container.style.zIndex = "999999";
  container.style.pointerEvents = "none";

  container.innerHTML = `
    <div style="position: relative; background-color: #ffffff; width: 800px; padding: 0; margin: 0; box-sizing: border-box; overflow: hidden; border: 1px solid #e2e8f0;">
      
      <!-- Background Diagonal Watermark -->
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden; z-index: 0;">
        <div style="position: absolute; top: 22%; left: -25%; width: 150%; transform: rotate(-35deg); font-size: 52px; font-weight: 900; color: rgba(37, 82, 108, 0.055); text-transform: uppercase; letter-spacing: 14px; white-space: nowrap; user-select: none; line-height: 2.2;">
          HUMAN BIOMEDICALS &nbsp;&nbsp; HUMAN BIOMEDICALS<br/>
          HUMAN BIOMEDICALS &nbsp;&nbsp; HUMAN BIOMEDICALS<br/>
          HUMAN BIOMEDICALS &nbsp;&nbsp; HUMAN BIOMEDICALS<br/>
          HUMAN BIOMEDICALS &nbsp;&nbsp; HUMAN BIOMEDICALS
        </div>
      </div>

      <!-- Top Header Bar -->
      <div style="position: relative; z-index: 2; background: linear-gradient(135deg, #1e3a8a 0%, #25526c 100%); color: #ffffff; padding: 22px 36px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="font-size: 26px; font-weight: 800; margin: 0; letter-spacing: -0.5px; text-transform: uppercase;">
            HUMAN BIOMEDICALS
          </h1>
          <p style="font-size: 12px; margin: 3px 0 0; opacity: 0.9; font-weight: 500;">
            LLP - Diagnostic Instruments & Healthcare Solutions
          </p>
        </div>
        <div style="text-align: right; font-size: 13px; line-height: 1.6; font-weight: 500;">
          <div><strong>Web:</strong> www.humanbiomedicals.org</div>
        </div>
      </div>

      <!-- Title & Subtitle Banner -->
      <div style="position: relative; z-index: 2; padding: 28px 36px 16px; text-align: center;">
        <h2 style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 14px; line-height: 1.3;">
          ${product.title}
        </h2>
        <div style="background: #d47828; color: #ffffff; font-size: 14px; font-weight: 700; padding: 10px 16px; border-radius: 6px; letter-spacing: 1px; text-transform: uppercase; display: block; box-shadow: 0 4px 10px rgba(212, 120, 40, 0.2);">
          OFFICIAL PRODUCT SPECIFICATION BROCHURE
        </div>
      </div>

      <!-- Two Column Layout: Image + Specifications -->
      <div style="position: relative; z-index: 2; padding: 16px 36px; display: grid; grid-template-columns: 290px 1fr; gap: 24px; align-items: start;">
        
        <!-- Left: Product Image Box -->
        <div style="border: 2px solid #e2e8f0; border-radius: 16px; padding: 18px; text-align: center; background: #ffffff; min-height: 250px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <img id="pdf-product-img" src="${imageSrc}" alt="${product.title}" style="max-width: 100%; max-height: 240px; object-fit: contain; border-radius: 8px; display: block; margin: 0 auto;" />
        </div>

        <!-- Right: Specifications Table -->
        <div style="border: 2px solid #25526c; border-radius: 12px; overflow: hidden; background: #ffffff;">
          <div style="background: #25526c; color: #ffffff; font-weight: 700; text-align: center; padding: 10px 12px; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase;">
            KEY SPECIFICATIONS
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tbody>
              <tr style="background: #f1f5f9; border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 9px 14px; font-weight: 700; color: #25526c; width: 40%;">Brand:</td>
                <td style="padding: 9px 14px; font-weight: 600; color: #1e293b;">${specs.brand}</td>
              </tr>
              <tr style="background: #ffffff; border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 9px 14px; font-weight: 700; color: #25526c;">Model:</td>
                <td style="padding: 9px 14px; font-weight: 600; color: #1e293b;">${specs.model}</td>
              </tr>
              <tr style="background: #f1f5f9; border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 9px 14px; font-weight: 700; color: #25526c;">Instrument:</td>
                <td style="padding: 9px 14px; font-weight: 600; color: #1e293b;">${specs.instrument}</td>
              </tr>
              <tr style="background: #ffffff; border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 9px 14px; font-weight: 700; color: #25526c;">Usage:</td>
                <td style="padding: 9px 14px; font-weight: 600; color: #1e293b;">${specs.usage}</td>
              </tr>
              <tr style="background: #f1f5f9; border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 9px 14px; font-weight: 700; color: #25526c;">Automation:</td>
                <td style="padding: 9px 14px; font-weight: 600; color: #1e293b;">${specs.automation}</td>
              </tr>
              <tr style="background: #ffffff; border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 9px 14px; font-weight: 700; color: #25526c;">Size / Capacity:</td>
                <td style="padding: 9px 14px; font-weight: 600; color: #1e293b;">${specs.capacity}</td>
              </tr>
              <tr style="background: #f1f5f9;">
                <td style="padding: 9px 14px; font-weight: 700; color: #25526c;">Availability:</td>
                <td style="padding: 9px 14px; font-weight: 600; color: #1e293b;">${specs.availability}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- Product Overview -->
      <div style="position: relative; z-index: 2; padding: 16px 36px; text-align: center;">
        <h3 style="font-size: 17px; font-weight: 800; color: #0f172a; margin: 0 0 10px; border-bottom: 2px solid #d47828; display: inline-block; padding-bottom: 4px; text-transform: uppercase;">
          PRODUCT OVERVIEW
        </h3>
        <p style="font-size: 13px; color: #475569; line-height: 1.6; margin: 0 auto; max-width: 95%; text-align: justify;">
          ${product.desc || product.description || `The ${product.title} is an advanced diagnostic analyzer reagent designed for high performance, accuracy, and reliability in medical laboratories, hospitals, and clinical settings across India.`}
        </p>
      </div>

      <!-- Highlights Cards Grid -->
      <div style="position: relative; z-index: 2; padding: 16px 36px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        
        <!-- Key Applications -->
        <div style="border: 2px solid #25526c; border-radius: 12px; background: #ffffff; overflow: hidden;">
          <div style="background: #25526c; color: #ffffff; font-weight: 700; text-align: center; padding: 9px; font-size: 13px; text-transform: uppercase;">
            KEY APPLICATIONS
          </div>
          <ul style="list-style: none; padding: 14px 18px; margin: 0; font-size: 12px; color: #334155; line-height: 1.9;">
            <li style="margin-bottom: 4px;"><span style="color: #d47828; font-weight: bold; margin-right: 8px; font-size: 14px;">●</span> Clinical Diagnostic Laboratories</li>
            <li style="margin-bottom: 4px;"><span style="color: #d47828; font-weight: bold; margin-right: 8px; font-size: 14px;">●</span> Hospitals & Healthcare Centres</li>
            <li style="margin-bottom: 4px;"><span style="color: #d47828; font-weight: bold; margin-right: 8px; font-size: 14px;">●</span> Pathology & Testing Labs</li>
            <li style="margin-bottom: 4px;"><span style="color: #d47828; font-weight: bold; margin-right: 8px; font-size: 14px;">●</span> Blood Banks & Research Units</li>
            <li><span style="color: #d47828; font-weight: bold; margin-right: 8px; font-size: 14px;">●</span> Medical Colleges & Institutions</li>
          </ul>
        </div>

        <!-- Why Choose Us -->
        <div style="border: 2px solid #25526c; border-radius: 12px; background: #ffffff; overflow: hidden;">
          <div style="background: #25526c; color: #ffffff; font-weight: 700; text-align: center; padding: 9px; font-size: 13px; text-transform: uppercase;">
            WHY CHOOSE HUMAN BIOMEDICALS
          </div>
          <ul style="list-style: none; padding: 14px 18px; margin: 0; font-size: 12px; color: #334155; line-height: 1.9;">
            <li style="margin-bottom: 4px;"><span style="color: #25526c; font-weight: bold; margin-right: 8px; font-size: 14px;">●</span> Trusted Biomedical Equipment Supplier</li>
            <li style="margin-bottom: 4px;"><span style="color: #25526c; font-weight: bold; margin-right: 8px; font-size: 14px;">●</span> 100% Genuine Leading Brand Products</li>
            <li style="margin-bottom: 4px;"><span style="color: #25526c; font-weight: bold; margin-right: 8px; font-size: 14px;">●</span> Competitive Pricing & Warranty Support</li>
            <li style="margin-bottom: 4px;"><span style="color: #25526c; font-weight: bold; margin-right: 8px; font-size: 14px;">●</span> Prompt Installation & Staff Training</li>
            <li><span style="color: #25526c; font-weight: bold; margin-right: 8px; font-size: 14px;">●</span> Fast Express Delivery Across India</li>
          </ul>
        </div>

      </div>

      <!-- Footer Bar -->
      <div style="position: relative; z-index: 2; margin-top: 24px; border-top: 3px solid #d47828; padding: 18px 36px 24px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #475569; background: #f8fafc;">
        <div>
          <div style="font-weight: 800; color: #0f172a; font-size: 12px;">
            HUMAN BIOMEDICALS LLP - Diagnostic Instruments & Healthcare Solutions
          </div>
          <div style="margin-top: 2px;">
            Biomedical equipment sales, service, installation, AMC & calibration across India
          </div>
        </div>
        <div style="font-style: italic; font-weight: 600; color: #64748b; text-align: right;">
          Official Product Brochure | Confidential & Proprietary
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(container);

  // Ensure DOM element image finishes decoding & loading inside container
  const pdfImg = container.querySelector("#pdf-product-img");
  if (pdfImg && !pdfImg.complete) {
    await new Promise((resolve) => {
      pdfImg.onload = resolve;
      pdfImg.onerror = resolve;
      setTimeout(resolve, 2000);
    });
  }
  await new Promise((resolve) => setTimeout(resolve, 350));

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    const fileName = `${product.title ? product.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "product"}-brochure.pdf`;
    pdf.save(fileName);
  } catch (err) {
    console.error("PDF generation error:", err);
    throw err;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
