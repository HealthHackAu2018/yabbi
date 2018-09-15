import os
import subprocess

import click


@click.command()
@click.argument('path', default=os.path.join('yabbi', 'tests'))
def cli(path):
    """
    Run tests with Pytest.

    :param path: Test path
    :return: Subprocess call result
    """
    cmd = 'py.test -vv {0}'.format(path)
    return subprocess.call(cmd, shell=True)
