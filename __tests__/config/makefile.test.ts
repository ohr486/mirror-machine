import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('Makefile', () => {
  const projectRoot = path.resolve(__dirname, '../..');
  const makefilePath = path.join(projectRoot, 'Makefile');

  beforeAll(() => {
    // Makefileが存在することを確認
    expect(fs.existsSync(makefilePath)).toBe(true);
  });

  describe('help target', () => {
    it('should display available commands', () => {
      const output = execSync('make help', {
        cwd: projectRoot,
        encoding: 'utf-8',
      });

      expect(output).toContain('test');
      expect(output).toContain('lint');
      expect(output).toContain('format');
      expect(output).toContain('cleanup');
      expect(output).toContain('dev');
      expect(output).toContain('logs');
    });
  });

  describe('test target', () => {
    it('should execute npm test', () => {
      // npm testが呼び出されることを確認
      // 実際のテスト実行は時間がかかるため、dry-runで確認
      const output = execSync('make -n test', {
        cwd: projectRoot,
        encoding: 'utf-8',
      });

      expect(output).toContain('npm test');
    });
  });

  describe('lint target', () => {
    it('should execute npm run lint', () => {
      const output = execSync('make -n lint', {
        cwd: projectRoot,
        encoding: 'utf-8',
      });

      expect(output).toContain('npm run lint');
    });
  });

  describe('format target', () => {
    it('should execute npm run format', () => {
      const output = execSync('make -n format', {
        cwd: projectRoot,
        encoding: 'utf-8',
      });

      expect(output).toContain('npm run format');
    });
  });

  describe('cleanup target', () => {
    it('should remove node_modules, coverage, dist, and .turbo directories', () => {
      const output = execSync('make -n cleanup', {
        cwd: projectRoot,
        encoding: 'utf-8',
      });

      expect(output).toContain('rm -rf');
      expect(output).toContain('node_modules');
      expect(output).toContain('coverage');
      expect(output).toContain('dist');
      expect(output).toContain('.turbo');
    });
  });

  describe('dev target', () => {
    it('should execute npm run dev', () => {
      const output = execSync('make -n dev', {
        cwd: projectRoot,
        encoding: 'utf-8',
      });

      expect(output).toContain('npm run dev');
    });
  });

  describe('logs target', () => {
    it('should tail logs/app.log', () => {
      const output = execSync('make -n logs', {
        cwd: projectRoot,
        encoding: 'utf-8',
      });

      expect(output).toContain('tail');
      expect(output).toContain('logs/app.log');
    });
  });
});
