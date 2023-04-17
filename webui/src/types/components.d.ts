declare namespace Props {
  type Selection<T> = {
    value?: T;
    onChange: (val: T) => void;
    filter?: T[];
  };
}
