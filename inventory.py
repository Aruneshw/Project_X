import ast
import os
import re
import json

def analyze_python_file(path):
    info = {"imports": [], "defined": []}
    try:
        with open(path, "r", encoding="utf-8") as f:
            tree = ast.parse(f.read())
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for name in node.names:
                    info["imports"].append(name.name)
            elif isinstance(node, ast.ImportFrom):
                module = node.module or ""
                for name in node.names:
                    info["imports"].append(f"{module}.{name.name}")
            elif isinstance(node, ast.FunctionDef) or isinstance(node, ast.AsyncFunctionDef):
                if not getattr(node, "_is_method", False):
                    info["defined"].append(f"Function: {node.name}")
            elif isinstance(node, ast.ClassDef):
                info["defined"].append(f"Class: {node.name}")
                for child in node.body:
                    if isinstance(child, ast.FunctionDef) or isinstance(child, ast.AsyncFunctionDef):
                        child._is_method = True
    except Exception as e:
        info["error"] = str(e)
    return info

def analyze_js_file(path):
    info = {"imports": [], "defined": []}
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
            # Simple regex for imports
            imports = re.findall(r'import.*?from\s+["\'](.*?)["\']', content)
            info["imports"].extend(imports)
            
            # Simple regex for functions
            funcs = re.findall(r'(?:function|const|let)\s+([a-zA-Z0-9_]+)\s*(?:=|)\s*(?:async\s+)?(?:function|\()', content)
            # Find window functions
            win_funcs = re.findall(r'window\.([a-zA-Z0-9_]+)\s*=\s*(?:async\s+)?function', content)
            # find fetch calls
            fetches = re.findall(r'fetch\([\'"`](.*?)[\'"`]', content)
            
            info["defined"].extend([f"Function: {f}" for f in set(funcs + win_funcs) if f])
            info["fetches"] = fetches
    except Exception as e:
        info["error"] = str(e)
    return info

inventory = {}
for root, dirs, files in os.walk("."):
    if "node_modules" in root or "venv" in root or ".git" in root or "dist" in root:
        continue
    for f in files:
        path = os.path.join(root, f)
        if f.endswith(".py"):
            inventory[path] = analyze_python_file(path)
        elif f.endswith(".js"):
            inventory[path] = analyze_js_file(path)

with open("inventory.json", "w") as out:
    json.dump(inventory, out, indent=2)
