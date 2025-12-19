import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { Profile } from '@/entities/profile'

interface PortfolioDocumentProps {
  student: Profile
}

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    fontFamily: 'Helvetica',
  },
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 5,
  },
  textBold: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  textSmall: {
    fontSize: 12,
    color: '#64748b',
  },
  trailBadge: {
    backgroundColor: '#e2e8f0',
    padding: '4px 8px',
    borderRadius: 18,
    fontSize: 12,
    fontWeight: 'semibold',
    color: '#1e293b',
  },
  aboutText: {
    fontSize: 14,
  },
  postSection: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: 5,
  },
  postContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#94a3b8',
    padding: 10,
    backgroundColor: '#f1f5f9',
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'semibold',
    color: '#334155',
  },
  postDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 1.4,
  },
  badgeGroup: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#e2e8f0',
    padding: '4px 8px',
    borderRadius: 18,
    fontSize: 12,
    fontWeight: 'semibold',
    color: '#1e293b',
  },
})

export function PortfolioDocument({ student }: PortfolioDocumentProps) {
  return (
    <Document title={`Portfólio de ${student.name}`}>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View
          style={{
            ...styles.section,
            gap: 10,
          }}
        >
          <Text style={styles.textBold}>{student?.name}</Text>
          <Text style={styles.textSmall}>
            {`@${student.username}`} • {`${student.semester}º semestre`}
          </Text>

          {student.trails.length > 0 && (
            <View style={styles.badgeGroup}>
              {student.trails.map(trail => (
                <Text key={trail} style={styles.trailBadge}>
                  {trail}
                </Text>
              ))}
            </View>
          )}

          <Text style={styles.aboutText}>{student?.about}</Text>
        </View>

        <View
          style={{
            ...styles.postSection,
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          <Text style={styles.textBold}>Posts</Text>

          {student?.posts.map(post => (
            <View key={post.id} style={styles.postContainer}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postDescription}>{post.description}</Text>

              <View style={styles.badgeGroup}>
                <Text style={styles.badge}>
                  {post.subject?.name || 'Disciplina não informada'}
                </Text>
                <Text style={styles.badge}>{post.semester}º Semestre</Text>
                <Text style={styles.badge}>{post.publishedYear}</Text>
              </View>

              <View
                style={{
                  ...styles.badgeGroup,
                  marginTop: 12,
                  gap: 16,
                }}
              >
                {post.professors.map(professor => (
                  <Text style={styles.textSmall} key={professor.id}>
                    {professor.name}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}
