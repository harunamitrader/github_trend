import json
import os

repos = [
    "Hmbown/DeepSeek-TUI",
    "addyosmani/agent-skills",
    "PriorLabs/TabPFN",
    "docusealco/docuseal",
    "LearningCircuit/local-deep-research",
    "LadybirdBrowser/ladybird",
    "InsForge/InsForge",
    "virattt/dexter",
    "anthropics/financial-services",
    "ruvnet/ruflo",
    "cheahjs/free-llm-api-resources",
    "shiyu-coder/Kronos",
    "bwya77/vscode-dark-islands",
    "bytedance/deer-flow",
    "D4Vinci/Scrapling"
]

file_path = r'C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\data\articles.json'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

results = {}
for repo in repos:
    results[repo] = repo in content

print(json.dumps(results, indent=2))
