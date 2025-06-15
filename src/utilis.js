import axiosInstance from "./axiosInstance";

const deleteSelectedRecords = async (model, selectedIds) => {
    try {
      const response = await axiosInstance.post("/admin_product/records/delete-selected", {
        model, // e.g., "product", "order", "parentCategory", "customer"
        ids: selectedIds, // Array of IDs to delete
      });
  
      if (response.status !== 200) {
        throw new Error("Failed to delete records");
      }
  
      alert(`${model}s deleted successfully`);
      return true; // Indicate success
    } catch (error) {
      console.error(`Error deleting ${model}s:`, error);
      alert(`An error occurred while deleting ${model}s`);
      return false; // Indicate failure
    }
  };


  export default deleteSelectedRecords;