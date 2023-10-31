const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const graphqlFolder = path.join('src', 'graphql');
const githubSchema = path.join(graphqlFolder, 'github.gqlschema');

fs.readdir(graphqlFolder, (err, members) => {
    if (err) {
      console.error(`Błąd odczytu ${graphqlFolder}:`, err);
      return;
    }
    
    for(const member of members) {
        const memberPath = path.join(graphqlFolder, member);

        fs.stat(memberPath, (err, stats) => {
            if (err) {
                console.error(`Błąd odczytu ${memberPath}`, err);
                return;
            }

            if (stats.isDirectory()) {
                const splitedMemberName = member.split("_");
                const operationType = splitedMemberName[0];
                const queryName = splitedMemberName[1];

                const outputPath = path.join(graphqlFolder, member, `${queryName}Generated.ts`);
                const gqlSource = path.join(graphqlFolder, member, `${queryName}.gql`);

                const command = `quicktype -o ${outputPath} -l ts`
                    + ` -t ${queryName}RawResult -s graphql --graphql-schema ${githubSchema} --no-runtime-typecheck`
                    + ` --src ${gqlSource}`;
                
                exec(command, (error, _) => {
                    if(error) {
                        console.error(`Błąd komendy `, error);
                    }
                    else {
                        try {
                            const query = fs.readFileSync(gqlSource, 'utf-8')
                            const appendedCode = `export const ${queryName}${toUpperFirstChar(operationType)}: string =\`\n${query}\`;\n` 
                                + `export type ${toUpperFirstChar(queryName)}Result = Data\n`
                                + fs.readFileSync(outputPath, 'utf-8');
                            fs.writeFileSync(outputPath, appendedCode);
                          } catch (err) {
                            console.error('Błąd:', err);
                          }
                    }
                });
            }
        });
    }
});

function toUpperFirstChar(string) {
    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}