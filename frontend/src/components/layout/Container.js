import styles from './Container.module.css'

function Container({children}) {
    return(
        // Utilizamos a tag children para a indentifição do conteúdo que está dentro do container. 
    <main className={styles.container}>
        {children}
    </main>
    )
}

export default Container