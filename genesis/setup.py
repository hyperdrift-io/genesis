from setuptools import setup, find_packages

setup(
    name="genesis",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        'jinja2',
    ],
    author="Hyper drift",
    description="A full stack web application generator",
)