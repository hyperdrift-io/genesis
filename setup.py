from setuptools import setup, find_packages

setup(
    name="genesis",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        'jinja2',
        'pyyaml',  # Add any other dependencies here
    ],
    author="Hyper drift",
    description="A full stack web application generator",
    url="https://github.com/yannvr/genesis",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
    entry_points={
        'console_scripts': [
            'genesis=genesis.cli:main',
        ],
    },
)
