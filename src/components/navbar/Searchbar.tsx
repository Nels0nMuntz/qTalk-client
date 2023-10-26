'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import debounce from 'lodash.debounce';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { SearchResult } from '@/types';
import { Users } from 'lucide-react';

export default function Searchbar() {
  const router = useRouter();
  const pathname = usePathname();
  const commandRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<string>('');
  const {
    data: queryResult,
    refetch,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      if (!value) return [];

      const { data } = await axios.get<SearchResult>(`/api/search?q=${value}`);
      return data;
    },
    queryKey: ['search'],
    enabled: false,
  });

  useEffect(() => {
    setValue('');
  }, [pathname]);

  const request = debounce(async () => {
    refetch();
  }, 400);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  return (
    <Command
      ref={commandRef}
      className="relative rounded-lg border max-w-lg z-50 overflow-visible"
    >
      <CommandInput
        onValueChange={(text) => {
          setValue(text);
          debounceRequest();
        }}
        value={value}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search communities..."
      />
      {Boolean(value.length) && (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {Boolean(queryResult?.length) && (
            <CommandGroup heading="Communities">
              {queryResult?.map(({ id, name }) => (
                <CommandItem
                  key={id}
                  value={name}
                  onSelect={(value) => {
                    router.push(`/t/${value}`);
                    router.refresh();
                  }}
                >
                  <Users className="w-4 h-4 mr-2" />
                  <a href={`/t/${name}`}>t/{name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      )}
    </Command>
  );
}
