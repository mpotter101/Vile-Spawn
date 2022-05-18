// Base Components
import Tabber from './component/Tabber';
import Group from './component/Group';
import Button from './component/Button';
import TextFileInput from './component/TextFileInput';

// App Components
import AnimationForm from './AnimationForm';
import AboutForm from './AboutForm';

export default class App {
    constructor ({ stageQuerySelector, animationCategories, canvasHeight, canvasWidth, keywords }) {
        this.const = {};
        this.const.CANVAS_HEIGHT = canvasHeight;
        this.const.CANVAS_WIDTH = canvasWidth;

        this.groups = {
            data: new Group ({
                parent: $(stageQuerySelector),
                class: 'ui segment group data-area',
                label: {
                    content: 'Save/Load'
                }
            }),
            about: new Group ({
                class: 'ui segment group about-form',
                parent: $(stageQuerySelector),
                label: {
                    content: 'About Your Character'
                }
            }),
            animation: new Group ({
                parent: $(stageQuerySelector),
                label: {
                    content: 'Animations'
                }
            }),
        }

        this.dataImporter = new TextFileInput ({
            parent: $(document.body),
            onFile: (data) => { this.HandleDataImport (data); }
        })

        this.exportButton = new Button ({
            parent: $(document.body),
            label: 'Export Data',
            onClick: (e) => { this.ExportData (); }
        })

        this.importButton = new Button ({
            parent: $(document.body),
            label: 'Import Data',
            onClick: (e) => { this.dataImporter.node.click (); }
        })

        this.groups.data.addContent (this.exportButton.node);
        this.groups.data.addContent (this.importButton.node);

        this.aboutForm = new AboutForm ({
            parent: $(document.body),
            keywords: keywords
        })

        this.groups.about.addContent (this.aboutForm.node);

        this.animationCategoriesNames = Object.keys (animationCategories);

        this.animationTabbers = {};
        this.animationForms = {};

        this.animationCategoryTabber = new Tabber ({
            parent: $(document.body),
            tabs: this.animationCategoriesNames
        });

        var item, targetTabIndex;
        for (var key in animationCategories) {
            item = animationCategories [key];

            this.CreateAnimationsTabberForCategory ({
                categoryName: key,
                category: item
            });
        }

        this.groups.animation.addContent (this.animationCategoryTabber.node);
    }

    CreateAnimationsTabberForCategory ({ category, categoryName }) {
        var targetTabIndex = this.animationCategoryTabber.getTabIndexByName (categoryName);

        this.animationTabbers [categoryName] = new Tabber ({
            parent: $(document.body),
            tabs: Object.keys (category)
        })

        this.animationCategoryTabber.addContent (
            targetTabIndex,
            this.animationTabbers [categoryName].node
        )

        this.CreateAnimationFormsForCategory ({
            category,
            categoryName,
            parentTabber: this.animationTabbers [categoryName]
        });
    }

    CreateAnimationFormsForCategory ({ category, categoryName, parentTabber }) {
        this.animationForms [categoryName] = {};

        var item;
        for (var key in category) {
            item = category [key];

            this.animationForms [categoryName] [key] = new AnimationForm (
                {
                    parent: $(document.body),
                    categoryName,
                    name: key,
                    optional: item.optional,
                    frameCount: 5,
                    frameDuration: 100,
                    canvasHeight: this.const.CANVAS_HEIGHT,
                    canvasWidth: this.const.CANVAS_WIDTH,
                    scrollDir: item.scrollDir,
                }
            );

            var targetTabIndex = parentTabber.getTabIndexByName (key);

            parentTabber.addContent (
                targetTabIndex,
                this.animationForms [categoryName] [key].node
            );

            if (item.optional) {
                parentTabber.tabs [targetTabIndex].node.addClass ('optional');
            }
        }
    }

    CollectStateData () {
        var data = {};
        data.about = this.aboutForm.GetState ();
        data.animationCategories = {};

        Object.keys (this.animationTabbers).forEach ((name) => {
            data.animationCategories [name] = {};

            Object.keys (this.animationForms [name]).forEach ((key) => {
                console.log (name, key)
                var item = this.animationForms [name] [key];
                data.animationCategories [name] [item.state.name] = item.GetState ();
            })
        });

        return data;
    }

    HandleDataImport (data) {
        console.log ("received file!");
        console.log (data.value);
        var json = JSON.parse (data.value);

        // about form
        this.aboutForm.ImportData (json.about);
        Object.keys (json.animationCategories).forEach ((categoryName) => {
            Object.keys (json.animationCategories [categoryName]).forEach ((animationName) => {
                console.log (this.animationForms)
                console.log (categoryName + ' ' + animationName)
                this.animationForms [categoryName] [animationName].ImportData (json.animationCategories [categoryName] [animationName]);
            })
        })
    }

    ExportData () {
        var data = this.CollectStateData();
        var name = data.about.name + "-game-data.json"
        var jsonFileContent = JSON.stringify (data, null, 4);
        this.Download (jsonFileContent, name, "text/plain");
    }

    // Borrowd from here: http://www.4codev.com/javascript/download-save-json-content-to-local-file-in-javascript-idpx473668115863369846.html
    Download(content, fileName, contentType) {
        const a = document.createElement("a");
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
}
