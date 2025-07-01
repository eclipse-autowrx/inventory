# Copyright (c) 2025 Eclipse Foundation.
# 
# This program and the accompanying materials are made available under the
# terms of the MIT License which is available at
# https://opensource.org/licenses/MIT.
#
# SPDX-License-Identifier: MIT

#!/usr/bin/env python3

import os
import re
import sys
from pathlib import Path

# MIT header templates for different file types
MIT_HEADERS = {
    '.js': """// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT""",
    
    '.ts': """// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT""",
    
    '.tsx': """// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT""",
    
    '.jsx': """// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT""",
    
    '.py': """# Copyright (c) 2025 Eclipse Foundation.
# 
# This program and the accompanying materials are made available under the
# terms of the MIT License which is available at
# https://opensource.org/licenses/MIT.
#
# SPDX-License-Identifier: MIT""",
    
    '.sh': """# Copyright (c) 2025 Eclipse Foundation.
# 
# This program and the accompanying materials are made available under the
# terms of the MIT License which is available at
# https://opensource.org/licenses/MIT.
#
# SPDX-License-Identifier: MIT""",
    
    '.yml': """# Copyright (c) 2025 Eclipse Foundation.
# 
# This program and the accompanying materials are made available under the
# terms of the MIT License which is available at
# https://opensource.org/licenses/MIT.
#
# SPDX-License-Identifier: MIT""",
    
    '.yaml': """# Copyright (c) 2025 Eclipse Foundation.
# 
# This program and the accompanying materials are made available under the
# terms of the MIT License which is available at
# https://opensource.org/licenses/MIT.
#
# SPDX-License-Identifier: MIT"""
}

def has_apache_header(content):
    """Check if file contains Apache license header"""
    # More flexible pattern to catch various Apache license formats
    apache_patterns = [
        r'Apache License.*Version 2\.0',
        r'apache\.org/licenses/LICENSE-2\.0',
        r'SPDX-License-Identifier:\s*Apache-2\.0',
        r'terms of the Apache License'
    ]
    for pattern in apache_patterns:
        if re.search(pattern, content, re.IGNORECASE):
            return True
    return False

def remove_apache_header(content, file_ext):
    """Remove Apache license header from content"""
    # For JS/TS files
    if file_ext in ['.js', '.ts', '.tsx', '.jsx']:
        # Pattern to match the entire Apache header block
        pattern = r'^(//[^\n]*Copyright[^\n]*\n(?://[^\n]*\n)*//[^\n]*(?:Apache|SPDX-License-Identifier:\s*Apache)[^\n]*\n*)'
        content = re.sub(pattern, '', content, flags=re.MULTILINE)
    
    # For Python/Shell/YAML files
    elif file_ext in ['.py', '.sh', '.yml', '.yaml']:
        # Pattern to match the entire Apache header block
        pattern = r'^(#[^\n]*Copyright[^\n]*\n(?:#[^\n]*\n)*#[^\n]*(?:Apache|SPDX-License-Identifier:\s*Apache)[^\n]*\n*)'
        content = re.sub(pattern, '', content, flags=re.MULTILINE)
    
    # Clean up any extra blank lines at the beginning
    content = re.sub(r'^\n+', '', content)
    
    return content

def update_file(file_path):
    """Update a single file to replace Apache with MIT header"""
    try:
        # Get file extension
        file_ext = file_path.suffix.lower()
        if file_ext not in MIT_HEADERS:
            return False, "Unsupported file type"
        
        # Read file content
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if file has Apache header
        if not has_apache_header(content):
            return False, "No Apache header found"
        
        # Remove Apache header
        content = remove_apache_header(content, file_ext)
        
        # Add MIT header
        mit_header = MIT_HEADERS[file_ext]
        new_content = mit_header + '\n\n' + content
        
        # Write updated content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        return True, "Updated successfully"
    
    except Exception as e:
        return False, f"Error: {str(e)}"

def main():
    repo_path = Path.cwd()
    updated_count = 0
    error_count = 0
    skipped_count = 0
    
    print(f"Updating Apache headers to MIT in: {repo_path}")
    print("-" * 60)
    
    # Find all relevant files
    extensions = list(MIT_HEADERS.keys())
    for ext in extensions:
        for file_path in repo_path.rglob(f'*{ext}'):
            # Skip node_modules and other common directories
            if any(part in file_path.parts for part in ['node_modules', '.git', 'dist', 'build', '.next']):
                continue
            
            success, message = update_file(file_path)
            
            if success:
                print(f"✓ Updated: {file_path.relative_to(repo_path)}")
                updated_count += 1
            elif "No Apache header" in message:
                skipped_count += 1
            else:
                print(f"✗ Failed: {file_path.relative_to(repo_path)} - {message}")
                error_count += 1
    
    print("-" * 60)
    print(f"Summary:")
    print(f"  Updated: {updated_count} files")
    print(f"  Skipped: {skipped_count} files (no Apache header)")
    print(f"  Errors: {error_count} files")
    
    return 0 if error_count == 0 else 1

if __name__ == "__main__":
    sys.exit(main())