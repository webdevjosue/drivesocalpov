# Subagents, Hooks, Plugins & Commands - Technical Documentation

## 🎯 Overview

This document provides comprehensive technical documentation for the automation building blocks: Subagents, Hooks, Plugins, and Commands that form the foundation of intelligent automation for Drive SoCal POV.

---

## 🤖 Subagents

### What are Subagents?
Subagents are specialized autonomous AI agents with domain-specific expertise that can be launched to handle complex tasks independently. Each subagent has access to specific tools and follows defined workflows.

### Available Subagent Types

#### 1. **General Purpose Agents**

##### `general-purpose`
- **Purpose**: Complex multi-step tasks, research, problem-solving
- **Tools**: All available tools (Read, Write, Edit, Bash, Web, etc.)
- **Use Cases**:
  - Researching complex topics
  - Multi-file code analysis
  - Comprehensive problem solving
- **Launch Pattern**:
```javascript
Task({
  subagent_type: "general-purpose",
  description: "Research mobile performance optimization",
  prompt: "Analyze the current mobile performance in src/components/map/MapContainer.tsx and provide optimization recommendations..."
})
```

##### `general-purpose-assistant`
- **Purpose**: Everyday assistance, writing, explanations
- **Tools**: All available tools
- **Use Cases**:
  - Code explanations
  - Writing assistance
  - General questions
- **Launch Pattern**:
```javascript
Task({
  subagent_type: "general-purpose-assistant",
  description: "Explain map performance",
  prompt: "Explain how the mobile performance monitoring works in this project..."
})
```

#### 2. **Feature Development Agents**

##### `feature-dev:code-architect`
- **Purpose**: Feature architecture design and implementation planning
- **Tools**: Glob, Grep, LS, Read, NotebookRead, WebFetch, TodoWrite, WebSearch, KillShell, BashOutput
- **Use Cases**:
  - Feature architecture design
  - Implementation planning
  - Component structure design
- **Expertise**:
  - Architecture pattern analysis
  - Implementation sequencing
  - Technical dependency mapping

##### `feature-dev:code-explorer`
- **Purpose**: Deep codebase analysis and feature understanding
- **Tools**: Same as code-architect
- **Use Cases**:
  - Understanding existing features
  - Mapping architecture layers
  - Documenting dependencies
- **Expertise**:
  - Code traversal and mapping
  - Pattern recognition
  - Architecture analysis

##### `feature-dev:code-reviewer`
- **Purpose**: Code quality review and bug detection
- **Tools**: Same as code-architect
- **Use Cases**:
  - Pre-commit code review
  - Quality assurance
  - Best practices validation
- **Expertise**:
  - Code quality analysis
  - Bug detection patterns
  - Security vulnerability scanning

#### 3. **PR Review Toolkit Agents**

##### `pr-review-toolkit:code-reviewer`
- **Purpose**: Comprehensive pull request review
- **Tools**: All available tools
- **Use Cases**:
  - Automated PR reviews
  - Style guide compliance
  - Best practices validation
- **Expertise**:
  - Code review methodology
  - Style guide enforcement
  - Quality gate validation

##### `pr-review-toolkit:code-simplifier`
- **Purpose**: Code simplification and refactoring
- **Tools**: All available tools
- **Use Cases**:
  - Code complexity reduction
  - Refactoring automation
  - Maintainability improvement
- **Expertise**:
  - Code simplification patterns
  - Refactoring best practices
  - Maintainability optimization

##### `pr-review-toolkit:silent-failure-hunter`
- **Purpose**: Error handling and silent failure detection
- **Tools**: All available tools
- **Use Cases**:
  - Error handling validation
  - Silent failure detection
  - Exception handling review
- **Expertise**:
  - Error pattern recognition
  - Exception handling analysis
  - Failure mode identification

##### `pr-review-toolkit:type-design-analyzer`
- **Purpose**: Type system design and analysis
- **Tools**: All available tools
- **Use Cases**:
  - Type design review
  - Encapsulation analysis
  - Type safety validation
- **Expertise**:
  - Type system design
  - Encapsulation patterns
  - Type safety analysis

##### `pr-review-toolkit:comment-analyzer`
- **Purpose**: Documentation and comment quality analysis
- **Tools**: All available tools
- **Use Cases**:
  - Documentation review
  - Comment quality validation
  - API documentation accuracy
- **Expertise**:
  - Documentation standards
  - Technical writing quality
  - API documentation accuracy

##### `pr-review-toolkit:pr-test-analyzer`
- **Purpose**: Test coverage and quality analysis
- **Tools**: All available tools
- **Use Cases**:
  - Test coverage analysis
  - Test quality validation
  - Edge case testing review
- **Expertise**:
  - Testing methodology
  - Coverage analysis
  - Test quality assessment

#### 4. **Agent SDK Development Agents**

##### `agent-sdk-dev:agent-sdk-verifier-py`
- **Purpose**: Python Agent SDK application validation
- **Tools**: All available tools
- **Use Cases**:
  - Python SDK validation
  - Best practices compliance
  - Deployment readiness checks
- **Expertise**:
  - Python SDK patterns
  - Agent SDK best practices
  - Python deployment patterns

##### `agent-sdk-dev:agent-sdk-verifier-ts`
- **Purpose**: TypeScript Agent SDK application validation
- **Tools**: All available tools
- **Use Cases**:
  - TypeScript SDK validation
  - Type safety verification
  - Deployment readiness
- **Expertise**:
  - TypeScript SDK patterns
  - Type system validation
  - Agent SDK architecture

#### 5. **Web Research Agents**

##### `web-search-researcher`
- **Purpose**: Web research and information gathering
- **Tools**: Edit, MultiEdit, Write, TodoWrite, BashOutput, KillShell, mcp__web-search-prime__webSearchPrime, Read
- **Use Cases**:
  - Market research
  - Technology research
  - Competitive analysis
- **Expertise**:
  - Research methodology
  - Information synthesis
  - Source validation

#### 6. **Status Management Agents**

##### `statusline-setup`
- **Purpose**: Claude Code status line configuration
- **Tools**: Read, Edit
- **Use Cases**:
  - Status line customization
  - UI configuration
- **Expertise**:
  - Claude Code configuration
  - Status line customization

##### `output-style-setup`
- **Purpose**: Claude Code output style configuration
- **Tools**: Read, Write, Edit, Glob, Grep
- **Use Cases**:
  - Output formatting
  - Style customization
- **Expertise**:
  - Output formatting patterns
  - Style customization

---

## 🔗 Hooks

### What are Hooks?
Hooks are event-driven triggers that automatically execute predefined actions in response to specific events or conditions.

### Hook Types

#### 1. **Tool Execution Hooks**
Triggered before/after tool execution

**Pre-Execution Hooks**:
```json
{
  "event": "tool:before:execute",
  "conditions": {
    "tool": "Bash",
    "command_pattern": "npm run *"
  },
  "actions": [
    "log_execution",
    "validate_command"
  ]
}
```

**Post-Execution Hooks**:
```json
{
  "event": "tool:after:execute",
  "conditions": {
    "tool": "mcp__vercel__deploy_to_vercel",
    "result": "success"
  },
  "actions": [
    "trigger_performance_test",
    "update_deployment_status"
  ]
}
```

#### 2. **File System Hooks**
Triggered by file changes

**File Creation Hooks**:
```json
{
  "event": "file:created",
  "conditions": {
    "pattern": "src/components/**/*.tsx",
    "excludes": ["*.test.tsx", "*.stories.tsx"]
  },
  "actions": [
    "run_type_check",
    "generate_documentation"
  ]
}
```

**File Modification Hooks**:
```json
{
  "event": "file:modified",
  "conditions": {
    "pattern": "package.json"
  },
  "actions": [
    "validate_dependencies",
    "update_lockfile"
  ]
}
```

#### 3. **Git Hooks**
Triggered by Git operations

**Pre-Commit Hooks**:
```json
{
  "event": "git:pre-commit",
  "actions": [
    "run_linter",
    "run_tests",
    "validate_types"
  ]
}
```

**Post-Merge Hooks**:
```json
{
  "event": "git:post-merge",
  "actions": [
    "install_dependencies",
    "run_build",
    "trigger_deployment"
  ]
}
```

#### 4. **Performance Hooks**
Triggered by performance metrics

**Performance Threshold Hooks**:
```json
{
  "event": "performance:threshold_exceeded",
  "conditions": {
    "metric": "fps",
    "threshold": 30,
    "duration": 5000
  },
  "actions": [
    "enable_performance_mode",
    "log_performance_issue",
    "notify_developer"
  ]
}
```

#### 5. **Error Hooks**
Triggered by error conditions

**Error Detection Hooks**:
```json
{
  "event": "error:detected",
  "conditions": {
    "source": "console",
    "severity": "error",
    "pattern": "TypeError|ReferenceError"
  },
  "actions": [
    "capture_error_context",
    "create_issue",
    "notify_team"
  ]
}
```

### Hook Configuration

#### Hook Definition Structure
```typescript
interface HookDefinition {
  id: string
  event: string
  conditions?: HookConditions
  actions: HookAction[]
  enabled: boolean
  priority: number
}

interface HookConditions {
  tool?: string
  pattern?: string
  excludes?: string[]
  result?: string
  metric?: string
  threshold?: number
  duration?: number
}

interface HookAction {
  type: 'agent' | 'tool' | 'notification' | 'script'
  target: string
  parameters?: Record<string, any>
}
```

---

## 🔌 Plugins

### What are Plugins?
Plugins are MCP (Model Context Protocol) servers that extend Claude's capabilities with specialized tools and integrations.

### Available Plugins

#### 1. **Supabase Plugin**
**Purpose**: Database operations and management

**Key Tools**:
- `mcp__supabase__apply_migration` - Schema updates
- `mcp__supabase__execute_sql` - Database queries
- `mcp__supabase__list_tables` - Schema inspection
- `mcp__supabase__generate_typescript_types` - Type generation
- `mcp__supabase__get_logs` - Error monitoring
- `mcp__supabase__get_advisors` - Performance recommendations

**Configuration**:
```json
{
  "plugin": "supabase",
  "tools": ["apply_migration", "execute_sql", "list_tables"],
  "permissions": ["read", "write", "admin"],
  "connection": {
    "project_url": "YOUR_SUPABASE_URL",
    "service_key": "YOUR_SERVICE_KEY"
  }
}
```

#### 2. **Vercel Plugin**
**Purpose**: Deployment and project management

**Key Tools**:
- `mcp__vercel__deploy_to_vercel` - Automated deployment
- `mcp__vercel__list_deployments` - Deployment history
- `mcp__vercel__get_deployment_build_logs` - Build analysis
- `mcp__vercel__search_vercel_documentation` - Documentation lookup

**Configuration**:
```json
{
  "plugin": "vercel",
  "tools": ["deploy_to_vercel", "list_deployments"],
  "permissions": ["deploy", "read"],
  "team_id": "YOUR_TEAM_ID"
}
```

#### 3. **Chrome DevTools Plugin**
**Purpose**: Browser automation and testing

**Key Tools**:
- `mcp__chrome-devtools__take_screenshot` - Visual testing
- `mcp__chrome-devtools__performance_start_trace` - Performance monitoring
- `mcp__chrome-devtools__evaluate_script` - Custom testing
- `mcp__chrome-devtools__emulate_network` - Network testing

**Configuration**:
```json
{
  "plugin": "chrome-devtools",
  "tools": ["take_screenshot", "performance_start_trace"],
  "permissions": ["browser_control", "system_access"],
  "browser": {
    "headless": false,
    "viewport": {"width": 375, "height": 667}
  }
}
```

#### 4. **Context7 Plugin**
**Purpose**: Library documentation and knowledge

**Key Tools**:
- `mcp__context7__resolve-library-id` - Library lookup
- `mcp__context7__get-library-docs` - Documentation retrieval

**Configuration**:
```json
{
  "plugin": "context7",
  "tools": ["resolve-library-id", "get-library-docs"],
  "permissions": ["documentation_access"],
  "cache": {
    "enabled": true,
    "ttl": 3600
  }
}
```

#### 5. **ZAI MCP Server**
**Purpose**: Media analysis and visual validation

**Key Tools**:
- `mcp__zai-mcp-server__analyze_image` - Image analysis
- `mcp__zai-mcp-server__analyze_video` - Video analysis

**Configuration**:
```json
{
  "plugin": "zai-mcp-server",
  "tools": ["analyze_image", "analyze_video"],
  "permissions": ["media_analysis"],
  "limits": {
    "max_file_size": "5MB",
    "supported_formats": ["png", "jpg", "jpeg", "mp4", "mov"]
  }
}
```

### Plugin Development

#### Custom Plugin Structure
```typescript
interface PluginDefinition {
  name: string
  version: string
  description: string
  tools: ToolDefinition[]
  permissions: string[]
  configuration?: PluginConfiguration
}

interface ToolDefinition {
  name: string
  description: string
  parameters: ParameterDefinition[]
  implementation: ToolImplementation
}
```

---

## ⚡ Commands

### What are Commands?
Commands are reusable automation workflows accessible via slash commands that encapsulate complex multi-step processes.

### Command Categories

#### 1. **Development Commands**

##### `/feature-dev:feature-dev`
**Purpose**: Guided feature development workflow
**Parameters**: Optional feature description
**Workflow**:
1. Analyze existing codebase
2. Design feature architecture
3. Create implementation plan
4. Generate component structure
5. Set up testing framework

**Example**:
```
/feature-dev:feature-dev Mobile map gesture controls
```

#### 2. **Code Review Commands**

##### `/pr-review-toolkit:review-pr`
**Purpose**: Comprehensive pull request review
**Parameters**: Review aspects (code-quality, security, performance, etc.)
**Workflow**:
1. Analyze code changes
2. Run quality checks
3. Validate security
4. Check performance
5. Generate review report

**Example**:
```
/pr-review-toolkit:review-pr code-quality,security,mobile-performance
```

#### 3. **Agent SDK Commands**

##### `/agent-sdk-dev:new-sdk-app`
**Purpose**: Create new Agent SDK application
**Parameters**: Project name
**Workflow**:
1. Initialize project structure
2. Configure SDK
3. Set up build system
4. Create sample agents
5. Configure deployment

**Example**:
```
/agent-sdk-dev:new-sdk-app drive-socal-automation
```

#### 4. **Git Workflow Commands**

##### `/commit-commands:commit`
**Purpose**: Intelligent git commit creation
**Workflow**:
1. Analyze staged changes
2. Generate commit message
3. Validate commit standards
4. Create commit
5. Update status

##### `/commit-commands:commit-push-pr`
**Purpose**: Complete workflow from commit to PR
**Workflow**:
1. Create commit
2. Push to remote
3. Create pull request
4. Add reviewers
5. Set up automation

#### 5. **Maintenance Commands**

##### `/commit-commands:clean_gone`
**Purpose**: Clean up git branches
**Workflow**:
1. Identify gone branches
2. Remove local references
3. Clean up worktrees
4. Update branch status

### Command Development

#### Custom Command Structure
```typescript
interface CommandDefinition {
  name: string
  description: string
  parameters?: ParameterDefinition[]
  workflow: WorkflowStep[]
  permissions: string[]
}

interface WorkflowStep {
  name: string
  type: 'agent' | 'tool' | 'condition' | 'loop'
  action: string
  parameters?: Record<string, any>
  conditions?: StepConditions
}
```

#### Command Example
```typescript
const mobileTestCommand: CommandDefinition = {
  name: "mobile-test",
  description: "Run comprehensive mobile testing suite",
  parameters: [
    {
      name: "device_types",
      type: "array",
      description: "Device types to test",
      default: ["mobile", "tablet"]
    }
  ],
  workflow: [
    {
      name: "setup_test_environment",
      type: "tool",
      action: "mcp__chrome-devtools__emulate_network",
      parameters: { throttlingOption: "Slow 4G" }
    },
    {
      name: "run_performance_test",
      type: "tool",
      action: "mcp__chrome-devtools__performance_start_trace",
      parameters: { reload: true, autoStop: true }
    },
    {
      name: "analyze_results",
      type: "agent",
      action: "feature-dev:code-reviewer",
      parameters: { focus: "mobile-performance" }
    }
  ],
  permissions: ["chrome-devtools", "agent-launch"]
}
```

---

## 🔧 Integration Patterns

### 1. **Sequential Agent Execution**
```javascript
// Execute agents in sequence with data passing
const agent1 = await Task({
  subagent_type: "feature-dev:code-explorer",
  prompt: "Analyze current map implementation..."
})

const agent2 = await Task({
  subagent_type: "feature-dev:code-architect",
  prompt: `Based on this analysis: ${agent1.result}, design optimization architecture...`
})
```

### 2. **Parallel Agent Execution**
```javascript
// Execute multiple agents simultaneously
const [performance, security, quality] = await Promise.all([
  Task({ subagent_type: "feature-dev:code-reviewer", prompt: "Focus on performance..." }),
  Task({ subagent_type: "pr-review-toolkit:silent-failure-hunter", prompt: "Focus on security..." }),
  Task({ subagent_type: "pr-review-toolkit:code-reviewer", prompt: "Focus on quality..." })
])
```

### 3. **Hook-Triggered Automation**
```javascript
// Automatically trigger agent on file changes
const hook = {
  event: "file:modified",
  pattern: "src/components/**/*.tsx",
  action: async () => {
    await Task({
      subagent_type: "pr-review-toolkit:code-reviewer",
      prompt: "Review changes to mobile components..."
    })
  }
}
```

### 4. **Plugin Integration**
```javascript
// Combine plugin tools with agent intelligence
const deploymentWorkflow = async () => {
  // Deploy with Vercel plugin
  const deployment = await mcp__vercel__deploy_to_vercel()

  // Test with Chrome DevTools
  await mcp__chrome_devtools__navigate_page(deployment.url)
  const screenshot = await mcp__chrome_devtools__take_screenshot()

  // Analyze with agent
  const analysis = await Task({
    subagent_type: "feature-dev:code-reviewer",
    prompt: `Analyze this deployment screenshot for mobile issues: ${screenshot}`
  })

  return analysis
}
```

---

## 📚 Best Practices

### 1. **Agent Selection**
- Choose the most specific agent for your task
- Use general-purpose agents only for multi-domain tasks
- Leverage specialized agents for better results

### 2. **Hook Configuration**
- Keep hooks simple and focused
- Avoid infinite loops in hook chains
- Use conditions to prevent unnecessary executions

### 3. **Plugin Usage**
- Cache plugin results when appropriate
- Handle plugin failures gracefully
- Use plugins for their specific domain expertise

### 4. **Command Design**
- Make commands composable and reusable
- Provide clear parameter descriptions
- Include error handling and rollback capabilities

### 5. **Performance Optimization**
- Use parallel execution when possible
- Cache expensive operations
- Monitor and optimize agent execution time

---

**Last Updated**: 2025-10-15
**Status**: Technical Reference
**Version**: 1.0