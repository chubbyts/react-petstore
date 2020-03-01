interface FieldArrayRenderProps {
  fields: {
    forEach: (iterator: (name: string, index: number) => void) => void;
    insert: (index: number, value: any) => void;
    map: (iterator: (name: string, index: number) => any) => any[];
    move: (from: number, to: number) => void;
    name: string;
    pop: () => any;
    push: (value: any) => void;
    remove: (index: number) => any;
    shift: () => any;
    swap: (indexA: number, indexB: number) => void;
    unshift: (value: any) => void;
  };
  meta: Partial<{
    active: boolean;
    dirty: boolean;
    dirtySinceLastSubmit: boolean;
    error: boolean;
    initial: boolean;
    invalid: boolean;
    pristine: boolean;
    submitError: boolean;
    submitFailed: boolean;
    submitSucceeded: boolean;
    touched: boolean;
    valid: boolean;
    visited: boolean;
  }>;
}

export default FieldArrayRenderProps;
