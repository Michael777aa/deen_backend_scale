import axios from "axios";

export const analyzeImage = async (imageUrl: string): Promise<string> => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/mknolan/internvl25-image-analyzer", // ViT model
      { inputs: imageUrl },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    // The ViT model returns classification scores
    const results = response.data;
    console.log("Classification results:", results);

    // Format the output based on model's classes
    return `Image classification results: ${JSON.stringify(results)}`;
  } catch (error: any) {
    console.error("Image analysis error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return "Unable to analyze the image at this time.";
  }
};
