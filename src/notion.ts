// src/utils/notion.ts
export function getNotionFileUrl(file: any) {
  if (!file) return null;
  if (file.type === "file") return file.file?.url || null;
  if (file.type === "external") return file.external?.url || null;
  return null;
}

export function escapeAttribute(value: any) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderRichText(richText: any[]) {
  if (!richText) return "";
  return richText
    .map(t => {
      let content = (t.plain_text || "").replace(/\n/g, "<br/>");
      if (t.href) content = `<a href="${t.href}" target="_blank" rel="noopener noreferrer">${content}</a>`;
      if (t.annotations?.bold) content = `<strong>${content}</strong>`;
      if (t.annotations?.italic) content = `<em>${content}</em>`;
      if (t.annotations?.strikethrough) content = `<s>${content}</s>`;
      if (t.annotations?.underline) content = `<u>${content}</u>`;
      if (t.annotations?.code) content = `<code>${content}</code>`;
      if (t.color && t.color !== "default") content = `<span style="color:${t.color}">${content}</span>`;
      return content;
    })
    .join("");
}

export function wrapLists(blocks: any[]) {
  const html: string[] = [];
  let listStack: string[] = [];

  blocks.forEach(block => {
    if (block.type === "bulleted_list_item") {
      if (listStack[listStack.length - 1] !== "ul") {
        html.push("<ul>");
        listStack.push("ul");
      }
      html.push(`<li>${renderRichText(block.bulleted_list_item?.rich_text)}</li>`);
    } else if (block.type === "numbered_list_item") {
      if (listStack[listStack.length - 1] !== "ol") {
        html.push("<ol>");
        listStack.push("ol");
      }
      html.push(`<li>${renderRichText(block.numbered_list_item?.rich_text)}</li>`);
    } else {
      while (listStack.length) {
        html.push(listStack.pop() === "ul" ? "</ul>" : "</ol>");
      }

      switch (block.type) {
        case "paragraph":
          html.push(`<p>${renderRichText(block.paragraph?.rich_text)}</p>`);
          break;
        case "heading_1":
          html.push(`<h1>${renderRichText(block.heading_1?.rich_text)}</h1>`);
          break;
        case "heading_2":
          html.push(`<h2>${renderRichText(block.heading_2?.rich_text)}</h2>`);
          break;
        case "heading_3":
          html.push(`<h3>${renderRichText(block.heading_3?.rich_text)}</h3>`);
          break;
        case "to_do":
          html.push(`<div><input type="checkbox" disabled ${block.to_do?.checked ? "checked" : ""}/> ${renderRichText(block.to_do?.rich_text)}</div>`);
          break;
        case "divider":
          html.push("<hr/>");
          break;
        case "quote":
          html.push(`<blockquote>${renderRichText(block.quote?.rich_text)}</blockquote>`);
          break;
        case "code":
          html.push(`<pre><code>${renderRichText(block.code?.rich_text)}</code></pre>`);
          break;
        case "image": {
          const imageUrl = getNotionFileUrl(block.image);
          const caption = renderRichText(block.image?.caption || []);
          const alt = block.image?.caption?.map((c: any) => c.plain_text).join("") || "Blog article image";

          if (imageUrl) {
            html.push(`<figure class="blog-image"><img src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(alt)}"/>${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`);
          }
          break;
        }
        default:
          break;
      }
    }
  });

  while (listStack.length) {
    html.push(listStack.pop() === "ul" ? "</ul>" : "</ol>");
  }

  return html.join("");
}