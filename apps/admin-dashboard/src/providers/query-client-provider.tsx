import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
  },
});
export type QueryClientProviderProps = {
  children: React.ReactNode;
};
export const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
  return (
    <ReactQueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </ReactQueryClientProvider>
  );
};
