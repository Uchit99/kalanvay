const API_URL = "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

export async function getArtworks() {
  const data = await request("/artworks");

  return data?.artworks || [];
}

export async function getFeaturedArtworks() {
  const data = await request("/artworks/featured");

  return data?.artworks || [];
}

export async function getArtwork(slug) {
  const data = await request(
    `/artworks/${encodeURIComponent(slug)}`
  );

  return data?.artwork || data;
}

export function formatArtwork(item) {
  return {
    ...item,
    price: Number(item.price),
    type: item.type === "ORIGINAL" ? "Original" : "Limited edition",
    image: item.images?.[0]?.url || item.image || "",
    images: item.images || [],
  };
}

export async function createCommission(payload) {
  return request("/commissions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getWishlist() {
  const data = await request("/wishlist");
  return data?.wishlist || [];
}

export async function addWishlistItem(artworkId) {
  return request("/wishlist", {
    method: "POST",
    body: JSON.stringify({ artworkId }),
  });
}

export async function removeWishlistItem(artworkId) {
  return request(`/wishlist/${encodeURIComponent(artworkId)}`, {
    method: "DELETE",
  });
}
