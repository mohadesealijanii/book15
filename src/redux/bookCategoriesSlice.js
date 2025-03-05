import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const updateCategory = createAsyncThunk(
  "bookCategories/updateCategory",
  async ({ id, editedTitle, editedCategory, token }, { rejectWithValue }) => {
    try {
      const updatedCategory = {
        id,
        title: editedTitle,
        parentId: editedCategory ? editedCategory.parentId : 5,
        categoryType: editedCategory ? editedCategory.categoryType : 0,
        hasBook: editedCategory ? editedCategory.hasBook : true,
      };

      const res = await fetch(
        "https://stg-core.bpapp.net/api/BookCategory/UpdateBookCategory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedCategory),
        }
      );

      if (!res.ok) throw new Error("Failed to update category");

      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  info: [],
  filteredCategories: [],
  currentPage: 1,
  categoryPerPage: 5,
  searchTerm: "",
  editingCategoryId: null,
  editedTitle: "",
  selectedId: "",
  loading: false,
  error: null,
};

const bookCategoriesSlice = createSlice({
  name: "BookCategories",
  initialState,
  reducers: {
    setInfo: (state, action) => {
      state.info = action.payload;
    },

    setFilteredCategories: (state, action) => {
      state.filteredCategories = action.payload;
    },

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    setCategoryPerPage: (state, action) => {
      state.categoryPerPage = action.payload;
    },

    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },

    setEditedTitle: (state, action) => {
      state.editedTitle = action.payload;
    },

    setSelectedId: (state, action) => {
      state.selectedId = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setEditingCategoryId: (state, action) => {
      state.editingCategoryId = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setInfo,
  setFilteredCategories,
  setCurrentPage,
  setCategoryPerPage,
  setSearchTerm,
  setEditingCategoryId,
  setEditedTitle,
  setLoading,
} = bookCategoriesSlice.actions;

export default bookCategoriesSlice.reducer;
