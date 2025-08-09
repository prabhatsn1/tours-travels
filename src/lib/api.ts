import axios from "axios";
import { TourPackage, ApiResponse } from "@/types";

const API_BASE_URL = "/api";

// Enhanced interface for API responses with pagination
interface PaginatedApiResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Interface for package query parameters
interface PackageQueryParams {
  category?: string;
  difficulty?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Interface for destination query parameters
interface DestinationQueryParams {
  search?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  tags?: string[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const packageAPI = {
  // Create a new package
  createPackage: async (
    packageData: Omit<
      TourPackage,
      "id" | "rating" | "reviewCount" | "createdAt" | "updatedAt"
    >
  ): Promise<ApiResponse<TourPackage>> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/packages`,
        packageData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating package:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data?.error || "Failed to create package"
        );
      }
      throw new Error("Failed to create package");
    }
  },

  // Get all packages with optional filtering and pagination
  getAllPackages: async (
    params: PackageQueryParams = {}
  ): Promise<PaginatedApiResponse<TourPackage[]>> => {
    try {
      const queryString = new URLSearchParams();

      // Add query parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryString.append(key, value.toString());
        }
      });

      const url = `${API_BASE_URL}/packages${
        queryString.toString() ? "?" + queryString.toString() : ""
      }`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching packages:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data?.error || "Failed to fetch packages"
        );
      }
      throw new Error("Failed to fetch packages");
    }
  },

  // Get featured packages
  getFeaturedPackages: async (): Promise<ApiResponse<TourPackage[]>> => {
    try {
      return await packageAPI.getAllPackages({ featured: true, limit: 6 });
    } catch (error) {
      console.error("Error fetching featured packages:", error);
      throw error;
    }
  },

  // Get packages by category
  getPackagesByCategory: async (
    category: string,
    limit?: number
  ): Promise<ApiResponse<TourPackage[]>> => {
    try {
      return await packageAPI.getAllPackages({ category, limit });
    } catch (error) {
      console.error("Error fetching packages by category:", error);
      throw error;
    }
  },

  // Search packages
  searchPackages: async (
    searchTerm: string,
    filters: Omit<PackageQueryParams, "search"> = {}
  ): Promise<PaginatedApiResponse<TourPackage[]>> => {
    try {
      return await packageAPI.getAllPackages({
        ...filters,
        search: searchTerm,
      });
    } catch (error) {
      console.error("Error searching packages:", error);
      throw error;
    }
  },

  // Get package by ID
  getPackageById: async (id: string): Promise<ApiResponse<TourPackage>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/packages/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching package:", error);
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 404) {
          throw new Error("Package not found");
        } else if (status === 400) {
          throw new Error("Invalid package ID");
        }
        throw new Error(
          error.response.data?.error || "Failed to fetch package"
        );
      }
      throw new Error("Failed to fetch package");
    }
  },

  // Update package
  updatePackage: async (
    id: string,
    packageData: Partial<TourPackage>
  ): Promise<ApiResponse<TourPackage>> => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/packages/${id}`,
        packageData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating package:", error);
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 404) {
          throw new Error("Package not found");
        } else if (status === 400) {
          throw new Error(
            error.response.data?.details || "Invalid data provided"
          );
        }
        throw new Error(
          error.response.data?.error || "Failed to update package"
        );
      }
      throw new Error("Failed to update package");
    }
  },

  // Delete package
  deletePackage: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/packages/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting package:", error);
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 404) {
          throw new Error("Package not found");
        } else if (status === 400) {
          throw new Error("Invalid package ID");
        }
        throw new Error(
          error.response.data?.error || "Failed to delete package"
        );
      }
      throw new Error("Failed to delete package");
    }
  },

  // Get package statistics (useful for admin dashboard)
  getPackageStats: async (): Promise<
    ApiResponse<{
      total: number;
      featured: number;
      categories: Record<string, number>;
      averagePrice: number;
    }>
  > => {
    try {
      // This would typically be a separate endpoint, but for now we'll use the main endpoint
      const response = await packageAPI.getAllPackages({ limit: 1000 });

      if (!response.success || !response.data) {
        throw new Error("Failed to fetch package statistics");
      }

      const packages = response.data;
      const total = packages.length;
      const featured = packages.filter((pkg) => pkg.featured).length;
      const categories: Record<string, number> = {};
      let totalPrice = 0;

      packages.forEach((pkg) => {
        categories[pkg.category] = (categories[pkg.category] || 0) + 1;
        totalPrice += pkg.price;
      });

      const averagePrice = total > 0 ? totalPrice / total : 0;

      return {
        success: true,
        data: {
          total,
          featured,
          categories,
          averagePrice,
        },
      };
    } catch (error) {
      console.error("Error fetching package statistics:", error);
      throw error;
    }
  },
};

// Additional utility functions for working with packages
export const packageUtils = {
  // Calculate discount percentage
  getDiscountPercentage: (
    originalPrice?: number,
    currentPrice?: number
  ): number => {
    if (!originalPrice || !currentPrice || originalPrice <= currentPrice) {
      return 0;
    }
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  },

  // Format price with currency
  formatPrice: (price: number, currency: string = "USD"): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  },

  // Get difficulty color for UI
  getDifficultyColor: (difficulty: string): string => {
    switch (difficulty) {
      case "Easy":
        return "success";
      case "Moderate":
        return "warning";
      case "Challenging":
        return "error";
      default:
        return "default";
    }
  },

  // Validate package data before submission
  validatePackageData: (packageData: Partial<TourPackage>): string[] => {
    const errors: string[] = [];

    if (!packageData.title?.trim()) {
      errors.push("Title is required");
    }

    if (!packageData.destination?.trim()) {
      errors.push("Destination is required");
    }

    if (!packageData.price || packageData.price <= 0) {
      errors.push("Price must be greater than 0");
    }

    if (!packageData.description?.trim()) {
      errors.push("Description is required");
    }

    if (!packageData.highlights?.length) {
      errors.push("At least one highlight is required");
    }

    if (!packageData.inclusions?.length) {
      errors.push("At least one inclusion is required");
    }

    if (!packageData.itinerary?.length) {
      errors.push("At least one itinerary day is required");
    }

    return errors;
  },
};

// API functions for destinations
export async function getDestinations(
  params?: DestinationQueryParams
): Promise<PaginatedApiResponse<import("@/types").Destination[]>> {
  const searchParams = new URLSearchParams();

  if (params?.search) searchParams.append("search", params.search);
  if (params?.region) searchParams.append("region", params.region);
  if (params?.minPrice)
    searchParams.append("minPrice", params.minPrice.toString());
  if (params?.maxPrice)
    searchParams.append("maxPrice", params.maxPrice.toString());
  if (params?.featured)
    searchParams.append("featured", params.featured.toString());
  if (params?.tags) searchParams.append("tags", params.tags.join(","));
  if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());

  const response = await fetch(`${API_BASE_URL}/destinations?${searchParams}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch destinations");
  }

  return response.json();
}

export async function getDestinationById(
  id: string
): Promise<ApiResponse<import("@/types").Destination>> {
  const response = await fetch(`${API_BASE_URL}/destinations/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch destination");
  }

  return response.json();
}

export async function createDestination(
  data: Omit<import("@/types").Destination, "id">
): Promise<ApiResponse<import("@/types").Destination>> {
  const response = await fetch(`${API_BASE_URL}/destinations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create destination");
  }

  return response.json();
}

export async function updateDestination(
  id: string,
  data: Partial<import("@/types").Destination>
): Promise<ApiResponse<import("@/types").Destination>> {
  const response = await fetch(`${API_BASE_URL}/destinations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update destination");
  }

  return response.json();
}

export async function deleteDestination(
  id: string
): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE_URL}/destinations/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete destination");
  }

  return response.json();
}
