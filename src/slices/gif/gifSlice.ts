import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchTrendingGifsAPI, searchGifsAPI } from './gifAPI';

export interface IGif {
  id: string;
  embed_url: string;
  url: string;
  images: {
    original_mp4: {
      mp4: string;
    }
  }
}

export interface IGifSlice {
  searchTerm: string;
  total: number;
  limit: number;
  offset: number;
  loading: boolean;
  list: IGif[];
}

const initialState: IGifSlice = {
  searchTerm: '',
  total: 0,
  limit: 30,
  offset: 0,
  loading: false,
  list: []
};

export const searchGifs = createAsyncThunk(
  'gif/search',
  async (searchTerm: string | undefined, { getState }) => {
    const state = getState() as RootState;
    const limit = selectLimit(state);
    let response;
    if (searchTerm) {
      response = await searchGifsAPI(searchTerm, 0, limit);
    } else {
      response = await fetchTrendingGifsAPI(0, limit);
    }
    return { searchTerm, payload: response.data };
  }
);

export const fetchNext = createAsyncThunk(
  'gif/fetchNext',
  async ({ onEnd }: { onEnd: () => void }, { getState }) => {
    try {
      const state = getState() as RootState;
      const limit = selectLimit(state);
      const offset = selectOffset(state);
      const searchTerm = selectSearchTerm(state);
      let response;
      if (searchTerm) {
        response = await searchGifsAPI(searchTerm, offset + limit, limit);
      } else {
        response = await fetchTrendingGifsAPI(offset + limit, limit);
      }
      onEnd?.();
      return response.data;
    } catch (e) {
      onEnd?.();
      throw e;
    }
  }
);

export const gifSlice = createSlice({
  name: 'gif',
  initialState,
  reducers: {
    clearGifList: (state) => {
      state.offset = 0;
      state.list = [];
      state.total = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchGifs.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchGifs.fulfilled, (state, { payload: { payload, searchTerm = '' } }) => {
        state.searchTerm = searchTerm;
        state.loading = false;
        state.list = payload.data;
        state.offset = 0;
        state.total = payload.pagination.total_count;
      })
      .addCase(searchGifs.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchNext.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNext.fulfilled, (state, action) => {
        state.offset = (state.offset + state.limit) > state.total ?
          state.total : (state.offset + state.limit);
        state.list = [...state.list, ...action.payload.data]
        state.loading = false;
      })
      .addCase(fetchNext.rejected, (state) => {
        state.loading = false;
      })
  },
});

export const selectLoading = (state: RootState) => state.gif.loading;
export const selectOffset = (state: RootState) => state.gif.offset;
export const selectLimit = (state: RootState) => state.gif.limit;
export const selectGifList = (state: RootState) => state.gif.list;
export const selectTotal = (state: RootState) => state.gif.total;
export const selectSearchTerm = (state: RootState) => state.gif.searchTerm;
export const selectIsLastPage = (state: RootState) => state.gif.total <= (state.gif.offset + state.gif.limit);

export const { clearGifList } = gifSlice.actions;

export default gifSlice.reducer;
