export default interface MigrationJsFile {
  up(): Promise<void>;

  down(): Promise<void>;
}
