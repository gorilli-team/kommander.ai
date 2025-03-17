import React from 'react';
import Widget from '../pages/Widget';
import Analytics from '../pages/Analytics';
import Docs from '../pages/Docs';
import Help from '../pages/Help';

interface MainProps {
    selectedPage: string;
}

export default function Main({
    selectedPage
}: MainProps) {
    const renderContent = () => {
        switch (selectedPage) {
            case "Analytics":
                return <Analytics />;
            case "Docs":
                return <Docs/>;
            case "Help":
                return <Help/>;
            case "Widget":
            default:
                return <Widget />;
        }
    };

    return (
        <main className="flex-1 overflow-y-auto main-layout bg-gray-900">
            {renderContent()}
        </main>
    );
}