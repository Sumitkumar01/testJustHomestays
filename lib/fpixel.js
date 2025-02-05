export const FB_PIXEL_ID = 506907947465846;
export const FB_PIXEL_ID2 = 399507636130758;

export const pageview = () => {
  window.fbq("track", "PageView");
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options = {}) => {
  window.fbq("track", name, options);
};
