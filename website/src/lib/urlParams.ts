export const urlParamsHelper = {
  getURLCategory: (categories: string[]): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && categories.includes(categoryParam)) {
      return categoryParam;
    }
    return null;
  }
};
