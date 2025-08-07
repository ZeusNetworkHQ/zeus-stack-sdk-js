# Contributing to Zeus Stack SDK

Thank you for your interest in contributing to the Zeus Stack SDK! This SDK enables Bitcoin-to-Solana cross-chain functionality through Zeus Program Library (ZPL), allowing Bitcoin to be bridged to Solana as zBTC.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10.8.1
- Basic understanding of:
  - Bitcoin transactions and UTXOs
  - Solana programs and accounts
  - Cross-chain bridging concepts

### Development Setup

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/ZeusNetworkHQ/zeus-stack-sdk-js.git
   cd zeus-stack-sdk-js
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Build the project:

   ```bash
   pnpm build
   ```

5. Run linting and formatting:
   ```bash
   pnpm lint
   pnpm format
   pnpm spell-check
   ```

## How to Contribute

### Reporting Issues

- Use GitHub Issues to report bugs or request features
- Search existing issues before creating new ones
- Provide detailed reproduction steps for bugs
- Include relevant Bitcoin/Solana network information

### Code Contributions

1. **Create a feature branch:**

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes:**

   - Follow existing code patterns and conventions
   - Add TypeScript types for all new functions
   - Update relevant documentation
   - Add tests if applicable

3. **Before submitting:**

   ```bash
   pnpm lint       # Fix linting issues
   pnpm format     # Format code
   pnpm build      # Ensure build works
   pnpm spell-check # Check spelling
   ```

4. **Commit your changes:**

   - Use conventional commit format: `feat:`, `fix:`, `docs:`, etc.
   - Keep commits focused and atomic

5. **Submit a Pull Request:**
   - Provide clear description of changes
   - Reference related issues
   - Include testing instructions

### Code Style

- Follow existing TypeScript/JavaScript conventions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Prefer explicit types over `any`
- Handle Bitcoin network differences (mainnet/testnet)

### Areas for Contribution

- **Bitcoin Integration:** PSBT construction, address derivation, fee estimation
- **Solana Integration:** Account fetching, instruction building, PDA derivation
- **Cross-chain Logic:** Bridge operations, reserve management
- **Developer Experience:** Better error messages, documentation, examples
- **Testing:** Unit tests, integration tests, example validation

## Development Guidelines

### Bitcoin-Related Changes

- Always handle both mainnet and testnet networks
- Verify PSBT construction with proper inputs/outputs
- Consider fee estimation accuracy
- Test address derivation thoroughly

### Solana-Related Changes

- Follow Solana program account patterns
- Ensure proper PDA derivation
- Handle account deserialization errors gracefully
- Consider transaction size limits

### Cross-chain Considerations

- Understand the Two-Way Peg mechanics
- Handle reserve address management properly
- Consider guardian certificate validation
- Account for network latency differences

## Testing

While comprehensive tests are being developed, please:

- Test your changes manually with both testnet and mainnet
- Verify Bitcoin transaction construction
- Validate Solana account interactions
- Check edge cases and error handling

## Questions or Need Help?

- Open a GitHub Discussion for questions
- Check existing documentation in README and code comments
- Review the Zeus Program Library documentation for program details

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
