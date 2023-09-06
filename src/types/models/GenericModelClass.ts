export interface GenericModelClass {
  // Method to modify the properties
  set: (obj: unknown) => void;
  // Method to get Object
  toObject: () => object;
}
