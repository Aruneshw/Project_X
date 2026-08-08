import json
import os

with open("inventory.json", "r") as f:
    data = json.load(f)

md = "# Phase 1: PIPELINE_INVENTORY\n\n"
md += "| File Path | Top-Level Defined | Imports | Used By (Inferred/Verified) |\n"
md += "| --- | --- | --- | --- |\n"

for path, info in sorted(data.items()):
    defined = "<br>".join(info.get("defined", []))
    if not defined: defined = "*(none)*"
    
    imports = "<br>".join(info.get("imports", []))
    if not imports: imports = "*(none)*"
    
    # Calculate what uses this
    module_name = path.replace("./backend/", "").replace(".py", "").replace("/", ".")
    used_by = []
    for other_path, other_info in data.items():
        if module_name in " ".join(other_info.get("imports", [])):
            used_by.append(other_path)
    
    used = "<br>".join(used_by)
    if not used: used = "*(none)*"
    
    md += f"| `{path}` | {defined} | {imports} | {used} |\n"

with open("PIPELINE_INVENTORY.md", "w") as f:
    f.write(md)

# Now generate a map outline to help me manually refine it
print("Created PIPELINE_INVENTORY.md")
