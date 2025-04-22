// src/types/global.d.ts
declare module '*.json' {
          const value: any;
          export default value;
}


// ✅ CORRECT
export type Link = {
          name: string
          href: string
}

export type Stat = {
          name: string
          value: string
}
