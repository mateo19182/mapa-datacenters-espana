#!/usr/bin/env node
// Runs the mapa-research OpenCode agent with the interface the runner expects:
// opencode-agent.mjs -C <checkout> -o <result file> <prompt>, context on stdin.
import { spawn } from 'node:child_process'
import fs from 'node:fs'

// Capacity errors are usually brief: retry the main model once, then change provider.
const attempts = [
  ['cliproxy-claude/claude-opus-5-5', 0],
  ['cliproxy-claude/claude-opus-5-5', 120],
  ['cliproxy-codex/gpt-6.1-sol', 0],
]

const args = process.argv.slice(2)
const option = (flag) => args[args.indexOf(flag) + 1]
const checkout = option('-C')
const output = option('-o')
const prompt = args.at(-1)
const message = `${prompt}\n\n${fs.readFileSync(0, 'utf8')}`

function run(model) {
  return new Promise((resolve) => {
    const child = spawn(process.env.MAPA_RESEARCH_OPENCODE_BIN ?? 'opencode',
      ['run', '--agent', 'mapa-research', '--model', model, '--format', 'json', '--title', 'mapa-research semanal'],
      { cwd: checkout, stdio: ['pipe', 'pipe', 'inherit'] })
    const texts = []
    const errors = []
    let pending = ''
    child.stdout.on('data', (chunk) => {
      process.stdout.write(chunk)
      pending += chunk
      const lines = pending.split('\n')
      pending = lines.pop()
      for (const line of lines) {
        try {
          const event = JSON.parse(line)
          if (event.type === 'text') texts.push(event.part.text)
          if (event.type === 'error') errors.push(event.error?.message ?? 'unknown error')
        } catch {}
      }
    })
    child.on('close', (code) => resolve({ ok: code === 0 && !errors.length && texts.length > 0, code, errors, text: texts.at(-1) }))
    child.stdin.end(message)
  })
}

for (const [index, [model, delay]] of attempts.entries()) {
  await new Promise((r) => setTimeout(r, delay * 1000))
  console.log(`\n=== intento ${index + 1}: ${model} ${new Date().toISOString()}`)
  const result = await run(model)
  if (result.ok) {
    fs.writeFileSync(output, result.text)
    process.exit(0)
  }
  console.log(`\n=== intento ${index + 1} fallido: código ${result.code} ${result.errors.join('; ')}`)
}
process.exit(1)
