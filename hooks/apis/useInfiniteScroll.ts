import { useRef, useCallback, useEffect, RefObject } from 'react';
import { GetNextPageParamFunction, QueryFunction, useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';

const useInfiniteScroll = (option: {
  queryKey: string[];
  queryFn: QueryFunction<any, any>;
  getNextPageParam?: GetNextPageParamFunction<any> | undefined;
}): [UseInfiniteQueryResult<any, unknown>, RefObject<HTMLDivElement>] => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const flagRef = useRef<HTMLDivElement>(null);
  const { queryKey, queryFn, getNextPageParam } = option;
  const infiniteQuery = useInfiniteQuery({
    queryKey: queryKey,
    queryFn,
    getNextPageParam,
  });

  const onIntersection: IntersectionObserverCallback = useCallback(
    async (entries, observer) => {
      if (entries[0].isIntersecting && !infiniteQuery.isFetching) {
        observer.unobserve(entries[0].target);
        await infiniteQuery.fetchNextPage();
      }
    },
    [infiniteQuery]
  );

  useEffect(() => {
    if (!flagRef.current) return;
    observerRef.current = new IntersectionObserver(onIntersection, {
      rootMargin: '10px',
    });
    if (infiniteQuery.hasNextPage) {
      observerRef.current.observe(flagRef.current);
    }
    return () => {
      observerRef.current && observerRef.current.disconnect();
    };
  }, [infiniteQuery.hasNextPage, onIntersection]);

  return [infiniteQuery, flagRef];
};

export default useInfiniteScroll;
