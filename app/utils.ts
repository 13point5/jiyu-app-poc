import useStore from "@/app/ReactFlow/store";
import { bgColors } from "@/app/constants";

const average = (a, b) => (a + b) / 2;

export const getSvgPathFromStroke = (points, closed = true) => {
  const len = points.length;

  if (len < 4) {
    return ``;
  }

  let a = points[0];
  let b = points[1];
  const c = points[2];

  let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
    2
  )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
    b[1],
    c[1]
  ).toFixed(2)} T`;

  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i];
    b = points[i + 1];
    result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(
      2
    )} `;
  }

  if (closed) {
    result += "Z";
  }

  return result;
};

export const formatHTMLWithMentions = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const spans = doc.getElementsByTagName("span");

  for (let i = spans.length - 1; i >= 0; i--) {
    const span = spans[i];
    const dataType = span.getAttribute("data-type");
    const dataId = span.getAttribute("data-id");

    if (dataType === "mention" && dataId) {
      const blockId = `<@block:${dataId}>`;
      const newElement = doc.createTextNode(blockId);
      span.parentNode?.replaceChild(newElement, span);
    }
  }

  return doc.body.innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
};

export const restoreHTMLFromMentions = (html: string) => {
  const blockIdRegex = /<@block:(.*?)>/g;
  const restoredHtml = html.replace(blockIdRegex, (_, blockId) => {
    const cssClass = getMentionClass(blockId);
    const dataLabel = getMentionLabel(blockId);
    return `<span data-type="mention" class="${cssClass}" data-id="${blockId}" data-label="${dataLabel}"></span>`;
  });

  return restoredHtml;
};

const getMentionClass = (blockId: string): string => {
  const node = useStore.getState().getNodeById(blockId);
  if (!node) return "";

  return `p-1 rounded-sm ${bgColors[node.type]}`;
};

const getMentionLabel = (blockId: string): string => {
  const node = useStore.getState().getNodeById(blockId);
  if (!node) return "";

  return node.data.name;
};
