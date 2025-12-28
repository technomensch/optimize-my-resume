# Documentation Index

## For Users

### Getting Started
- [Quick Start Guide](../README.md) - Get up and running in 5 minutes
- [Changelog](CHANGELOG.md) - Version history and release notes
- [Roadmap](ROADMAP.md) - Upcoming features and milestones

### Project Info
- **Current Version:** v5.0
- **License:** See root LICENSE file
- **Repository:** https://github.com/technomensch/optimize-my-resume 

## For Developers

### Developer Tools
- [Documentation Update Protocol](prompts/dev/Update_Doc_Prompt.md) - How to update docs
- [Testing Protocol](prompts/dev/Testing_Protocol.md) - Prompt testing guidelines
- [Developer Changelog](CHANGELOG_DEV.md) - Developer experience changes (tools, process, lessons learned)

### Implementation Plans
- [Plans Index](plans/README.md) - Overview of PLANS vs ROADMAP vs PROMPTS

## For AI Prompt Engineers

### Reference
- [Prompt Parameters](prompts/PARAMETERS.md) - Global parameters reference
- [Prompts Index](prompts/README.md) - All prompts overview

## Documentation Structure

```
/docs/
├── README.md (you are here)
├── CHANGELOG.md          # User-facing changes
├── CHANGELOG_DEV.md      # Developer experience changes
├── ROADMAP.md
├── plans/                # Implementation plans for features
│   ├── README.md
├── guides/               # User-facing guides
└── prompts/              # AI behavior specifications
    ├── README.md
    ├── PARAMETERS.md
    ├── sys/              # System prompts
    │   ├── README.md
    └── dev/              # Developer documentation
        ├── README.md
        ├── Update_Doc_Prompt.md
        └── Testing_Protocol.md
```

## Contributing

When updating documentation:
1. Follow [Update Doc Protocol](prompts/dev/Update_Doc_Prompt.md)
2. Update version histories in modified files
3. Add entries to [CHANGELOG.md](CHANGELOG.md) for user-facing changes
4. Add entries to [CHANGELOG_DEV.md](CHANGELOG_DEV.md) for developer tools, process improvements, or lessons learned
5. Test all links

## Quick Links

### Most Commonly Used
- [System Prompt](prompts/sys/System_Prompt.md) - Main system documentation
- [Update Doc Protocol](prompts/dev/Update_Doc_Prompt.md) - How to update docs
- [CHANGELOG](CHANGELOG.md) - User-facing changes
- [CHANGELOG_DEV](CHANGELOG_DEV.md) - Developer experience changes

