---
title: QGraphicsView缩放后并保持item不缩放的几种方式
date: 2025-05-28 11:07:38
tags: QT
categories: 'QT'
---

一般来说，加入到QGraphicsScene的item会随着view的缩放自动缩放，有些item需要保持自身的大小，例如线条item，如果随着view的缩放，其宽度也会发生变化，这显然是不符合需求的，为了消除view缩放带来的影响，探索了以下三种方式，在view中，item可以始终保持自身缩放比例
1、使用 ItemIgnoresTransformations 标志的项
2、通过重写 paint 实现逆变换的项
3、手动控制缩放的视图
以下为示例代码，详细展示了三种控制item缩放的方式
```c++
#include <QApplication>
#include <QGraphicsView>
#include <QGraphicsScene>
#include <QGraphicsRectItem>
#include <QGraphicsEllipseItem>
#include <QWheelEvent>
#include <QLabel>
#include <QVBoxLayout>
#include <QDebug>

// 方法1：使用 ItemIgnoresTransformations 标志的项
class FixedSizeItem1 : public QGraphicsEllipseItem {
public:
    FixedSizeItem1(qreal x, qreal y, qreal w, qreal h, QGraphicsItem* parent = nullptr)
        : QGraphicsEllipseItem(x, y, w, h, parent) {
        setFlag(QGraphicsItem::ItemIgnoresTransformations, true);
        setBrush(Qt::red);
    }
};

// 方法2：通过重写 paint 实现逆变换的项
class FixedSizeItem2 : public QGraphicsRectItem {
public:
    FixedSizeItem2(qreal x, qreal y, qreal w, qreal h, QGraphicsItem* parent = nullptr)
        : QGraphicsRectItem(x, y, w, h, parent) {
        setBrush(Qt::green);
    }

    void paint(QPainter* painter, const QStyleOptionGraphicsItem* option, QWidget* widget) override {
        painter->save();
        qreal scale = 1.0 / painter->transform().m11();
        painter->scale(scale, scale);
        QGraphicsRectItem::paint(painter, option, widget);
        painter->restore();
    }
};

// 方法3：手动控制缩放的视图
class CustomGraphicsView : public QGraphicsView {
public:
    CustomGraphicsView(QGraphicsScene* scene, QWidget* parent = nullptr)
        : QGraphicsView(scene, parent) {
        // 创建需要手动控制的固定大小项
        manualItem = new QGraphicsEllipseItem(-15, -15, 30, 30);
        manualItem->setBrush(Qt::blue);
        scene->addItem(manualItem);
        manualItem->setPos(150, 150);
        
        // 设置视图缩放相关属性
        setTransformationAnchor(QGraphicsView::AnchorUnderMouse);
        setResizeAnchor(QGraphicsView::AnchorViewCenter);
        setDragMode(QGraphicsView::ScrollHandDrag);
    }

protected:
    void wheelEvent(QWheelEvent* event) override {
        // 计算缩放因子 (1.2倍或0.8倍)
        qreal scaleFactor = event->angleDelta().y() > 0 ? 1.2 : 1/1.2;
        
        // 执行缩放
        scale(scaleFactor, scaleFactor);
        
        // 对需要固定大小的项应用逆缩放
        manualItem->setScale(1.0 / transform().m11());
    }

private:
    QGraphicsEllipseItem* manualItem;
};

int main(int argc, char* argv[]) {
    QApplication app(argc, argv);

    // 创建主窗口
    QWidget mainWindow;
    QVBoxLayout* layout = new QVBoxLayout(&mainWindow);

    // 创建场景
    QGraphicsScene scene;
    scene.setSceneRect(0, 0, 300, 300);
    scene.setBackgroundBrush(Qt::lightGray);

    // 添加普通可缩放项
    QGraphicsRectItem* scalableItem = new QGraphicsRectItem(0, 0, 200, 200);
    scalableItem->setBrush(Qt::yellow);
    scene.addItem(scalableItem);

    // 添加方法1的固定大小项
    FixedSizeItem1* fixedItem1 = new FixedSizeItem1(-15, -15, 30, 30);
    scene.addItem(fixedItem1);
    fixedItem1->setPos(50, 50);

    // 添加方法2的固定大小项
    FixedSizeItem2* fixedItem2 = new FixedSizeItem2(-15, -15, 30, 30);
    scene.addItem(fixedItem2);
    fixedItem2->setPos(100, 100);

    // 创建视图
    CustomGraphicsView view(&scene);
    view.setAlignment(Qt::AlignLeft|Qt::AlignTop);
    view.setMouseTracking(true);
    view.setRenderHint(QPainter::Antialiasing);
    view.setDragMode(QGraphicsView::ScrollHandDrag);

    // 添加说明标签
    QLabel* label = new QLabel(
        "使用鼠标滚轮缩放视图:\n"
        "红色: ItemIgnoresTransformations\n"
        "绿色: 重写paint方法\n"
        "蓝色: 手动控制缩放\n"
        "黄色: 普通可缩放项");
    label->setAlignment(Qt::AlignCenter);

    // 设置布局
    layout->addWidget(label);
    layout->addWidget(&view);

    // 显示窗口
    mainWindow.resize(600, 600);
    mainWindow.show();

    return app.exec();
}
```