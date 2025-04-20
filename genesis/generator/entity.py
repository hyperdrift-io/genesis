class Entity:
    def __init__(self, name, entity_type, attributes=None):
        self.name = name
        self.type = entity_type
        self.attributes = attributes or []

    def __repr__(self):
        return f"Entity(name='{self.name}', type='{self.type}')"
