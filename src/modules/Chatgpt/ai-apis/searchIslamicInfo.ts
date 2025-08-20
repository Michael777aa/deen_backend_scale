import axios from "axios";

export const searchIslamicTopic = async (query: string): Promise<string[]> => {
  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        q: `${query} site:islamqa.info`,
        engine: "google",
        api_key: process.env.SERP_API_KEY,
      },
    });

    return (response.data.organic_results || [])
      .filter((r: any) => r.link.includes("islamqa.info"))
      .map((r: any) => r.link)
      .slice(0, 3);
  } catch (err) {
    console.error("searchIslamicTopic error:", err);
    return [];
  }
};
