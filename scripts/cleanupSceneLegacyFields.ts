import { getCliClient } from 'sanity/cli'

const LEGACY_FIELDS = ['image', 'gifFile', 'lottieFile', 'gifUrl', 'lottieUrl', 'order']

async function run() {
  const client = getCliClient({ apiVersion: '2025-02-19' })
  const docs = await client.fetch<Array<{ _id: string }>>(
    `*[_type == "scene" && (
      defined(image) ||
      defined(gifFile) ||
      defined(lottieFile) ||
      defined(gifUrl) ||
      defined(lottieUrl) ||
      defined(order)
    )]{_id}`
  )

  if (!docs.length) {
    console.log('No scene documents with legacy fields found.')
    return
  }

  let tx = client.transaction()
  for (const doc of docs) {
    tx = tx.patch(doc._id, (patch) => patch.unset(LEGACY_FIELDS))
  }

  await tx.commit()
  console.log(`Cleaned legacy fields in ${docs.length} scene document(s).`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
