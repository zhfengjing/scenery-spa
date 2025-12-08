import type { Draft } from 'immer';
import {produce} from 'immer';
import { useCallback, useState  } from 'react';


export type DraftFunction<T> = (draft: Draft<T>) => void;
export type Updater<T> = (args: T | DraftFunction<T>) => void;
export type ImmerHook<T> = [T, Updater<T>];

// 函数的签名
// export function useImmer<T>(initialValue: T): ImmerHook<T>;

export function useImmer<S=unknown>(initialValue: S):ImmerHook<S> {
    const [data, setData] = useState<S>(initialValue);

    const updateData = useCallback((updater:S | DraftFunction<S>)=>{
        if(typeof updater !== 'function'){
            setData(updater);
            return;
        }
        setData(produce(updater as DraftFunction<S>));
    },[])
    return [data, updateData];
}