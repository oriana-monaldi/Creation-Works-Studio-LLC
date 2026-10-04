import { useState } from 'react'
import { projects } from '../data/projects'
import type { Copy, Language } from '../data/content'
import { Arrow } from '../components/Icons'
import { Modal } from '../components/Modal'
import { ProjectVisual } from '../components/ProjectVisual'
import { SectionTitle } from '../components/SectionTitle'
export function Work({ copy, language }: { copy: Copy; language: Language }) {
  const [selected, setSelected] = useState<number | null>(null)
  const l = language === 'en' ? 0 : 1
  return (
    <section id="work" className="work-section" aria-labelledby="work-title">
      <div className="section-padding work-heading">
        <span className="section-kicker">
          <span className="orange-square" />
          03 / {copy.workLabel}
        </span>
        <div className="heading-row">
          <SectionTitle id="work-title" first={copy.workTitle[0]} second={copy.workTitle[1]} />
          <div className="work-heading-right">
            <p>{copy.workText}</p>
          </div>
        </div>
      </div>
      <div className="project-track">
        {projects.map((project, i) => (
          <article className="project-panel" key={project.id}>
            <button
              className="project-open"
              onClick={() => setSelected(i)}
              aria-label={`${copy.project}: ${language === 'es' ? project.esTitle : project.title}`}
            >
              <ProjectVisual language={language} kind={project.className} />
              <span className="project-open-label">
                {copy.project}
                <Arrow diagonal />
              </span>
            </button>
            <div className="project-info">
              <div>
                <span className="project-id">
                  0{i + 1} / {copy.concept}
                </span>
                <h3>{language === 'es' ? project.esTitle : project.title}</h3>
              </div>
              <span>{project.category[l]}</span>
              <button
                className="circle-link"
                onClick={() => setSelected(i)}
                aria-label={`${copy.project}: ${language === 'es' ? project.esTitle : project.title}`}
              >
                <Arrow diagonal />
              </button>
            </div>
            <p className="project-summary">{project.type[l]}</p>
          </article>
        ))}
      </div>
      {selected !== null && (
        <Modal className="project-dialog" language={language} onClose={() => setSelected(null)} label={copy.close}>
          <div className="project-modal">
            <div className="project-detail-header">
              <div>
                <span className="section-kicker">{copy.concept} / 0{selected + 1}</span>
                <h2>{(language === 'es'
                  ? ['E-commerce', 'IA y automatización', 'Marca y web']
                  : ['E-commerce', 'AI & automation', 'Brand & web'])[selected]}</h2>
                <p className="project-detail-intro">{projects[selected].type[l]}</p>
              </div>
              <ProjectVisual language={language} kind={projects[selected].className} large />
            </div>
            <dl>
              <div>
                <dt>{copy.problem}</dt>
                <dd>{projects[selected].problem[l]}</dd>
              </div>
              <div>
                <dt>{copy.solution}</dt>
                <dd>{projects[selected].solution[l]}</dd>
              </div>
              <div>
                <dt>{copy.technology}</dt>
                <dd>{projects[selected].technologies}</dd>
              </div>
              <div>
                <dt>{copy.result}</dt>
                <dd>{projects[selected].outcome[l]}</dd>
              </div>
            </dl>
          </div>
        </Modal>
      )}
    </section>
  )
}
