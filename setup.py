from setuptools import setup

setup(
    name='Yabbi-CLI',
    version='1.0',
    packages=['cli', 'cli.commands'],
    include_package_data=True,
    install_requires=[
        'click',
    ],
    entry_points="""
        [console_scripts]
        yabbi=cli.cli:cli
    """,
)
