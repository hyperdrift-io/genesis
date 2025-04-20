import re

class PromptAnalyzer:
    """Analyzer for app descriptions to extract entities and features"""
    def __init__(self):
        self.entity_patterns = [
            (r'user', 'user'),
            (r'product', 'product'),
            (r'post', 'post'),
            (r'comment', 'comment'),
            (r'order', 'order'),
            (r'item', 'item'),
            (r'category', 'category'),
            (r'profile', 'profile'),
            (r'task', 'task'),
            (r'project', 'project'),
        ]
        self.feature_patterns = [
            (r'auth|login|signin|register', 'authentication'),
            (r'admin|dashboard', 'admin_dashboard'),
            (r'payment|checkout', 'payment_processing'),
            (r'search', 'search'),
            (r'notification', 'notifications'),
            (r'messaging|chat', 'messaging'),
            (r'upload|image|photo', 'file_upload'),
            (r'real-time|realtime|live', 'real_time'),
            (r'persist|database|store|save', 'persistence'),
        ]
        self.functionality_patterns = [
            (r'filter|sort|search', 'filtering_and_sorting'),
            (r'create|add|new', 'create_functionality'),
            (r'edit|update|modify', 'edit_functionality'),
            (r'delete|remove', 'delete_functionality'),
            (r'view|display|show', 'view_functionality'),
            (r'publish|draft', 'publishing_workflow'),
            (r'rate|review|star', 'rating_and_reviews'),
            (r'follow|subscribe|friend', 'social_connections'),
            (r'import|export', 'data_import_export'),
            (r'tag|label|categorize', 'tagging_system'),
            (r'schedule|calendar|date', 'scheduling'),
            (r'map|location|geo', 'geolocation'),
            (r'report|analytics|chart', 'reporting'),
        ]
        self.relationship_patterns = [
            (r'(\w+)\s+belongs\s+to\s+(\w+)', 'belongs_to'),
            (r'(\w+)\s+has\s+many\s+(\w+)', 'has_many'),
            (r'(\w+)\s+has\s+one\s+(\w+)', 'has_one'),
            (r'(\w+)\s+many\s+to\s+many\s+(\w+)', 'many_to_many'),
        ]
    def analyze(self, description):
        description = description.lower()
        entities = []
        for pattern, entity_type in self.entity_patterns:
            if re.search(pattern, description):
                entities.append({'name': entity_type, 'type': entity_type})
        features = []
        for pattern, feature in self.feature_patterns:
            if re.search(pattern, description):
                features.append(feature)
        functionality = []
        for pattern, func_type in self.functionality_patterns:
            if re.search(pattern, description):
                functionality.append(func_type)
        relationships = []
        for pattern, rel_type in self.relationship_patterns:
            matches = re.finditer(pattern, description)
            for match in matches:
                if match and len(match.groups()) >= 2:
                    entity1, entity2 = match.groups()
                    relationships.append({
                        'type': rel_type,
                        'entity1': entity1,
                        'entity2': entity2
                    })
        if not any(f == 'authentication' for f in features) and any(e['type'] == 'user' for e in entities):
            features.append('authentication')
        persistence_needed = any(f in ['persistence'] for f in features)
        if 'authentication' in features and not persistence_needed:
            features.append('persistence')
        tech_stack = 'nextjs'
        backend = False
        requires_supabase = False
        if any(f in ['authentication', 'persistence', 'file_upload', 'real_time'] for f in features):
            requires_supabase = True
            backend = True
        default_funcs = ['create_functionality', 'view_functionality', 'edit_functionality', 'delete_functionality']
        for func in default_funcs:
            if func not in functionality:
                functionality.append(func)
        return {
            'name': 'app',
            'description': description,
            'entities': entities,
            'features': features,
            'functionality': functionality,
            'relationships': relationships,
            'tech_stack': tech_stack,
            'backend': backend,
            'requires_supabase': requires_supabase,
            'local_first': not requires_supabase
        }
