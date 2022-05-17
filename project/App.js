// Base Components
import Tabber from './component/Tabber';
import Group from './component/Group';
import Button from './component/Button';

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

        this.exportButton = new Button ({
            parent: this.groups.data.node,
            label: 'Export Data',
            onClick: (e) => { this.ExportData(); }
        })

        this.aboutForm = new AboutForm ({
            parent: $(document.body),
            keywords: keywords
        })

        this.groups.about.addContent (this.aboutForm.node);

        this.animationCategoriesNames = Object.keys (animationCategories);

        this.animations = {};
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

        this.animations [categoryName + 'Tabber'] = new Tabber ({
            parent: $(document.body),
            tabs: Object.keys (category)
        })

        this.animationCategoryTabber.addContent (
            targetTabIndex,
            this.animations [categoryName + 'Tabber'].node
        )

        this.CreateAnimationFormsForCategory ({
            category,
            categoryName,
            parentTabber: this.animations [categoryName + 'Tabber']
        });
    }

    CreateAnimationFormsForCategory ({ category, categoryName, parentTabber }) {
        var item;
        for (var key in category) {
            item = category [key];

            var formName = categoryName + '-' + key;
            this.animationForms [formName] = new AnimationForm (
                {
                    parent: $(document.body),
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
                this.animationForms [formName].node
            );

            if (item.optional) {
                parentTabber.tabs [targetTabIndex].node.addClass ('optional');
            }
        }
    }

    CollectStateData () {
        var data = {};
        data.about = this.aboutForm.GetState ();
        data.animation = {};

        Object.keys (this.animationForms).forEach ((name) => {
            data.animation [name] = this.animationForms [name].GetState ();
        });

        return data;
    }

    ImportData () {

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
